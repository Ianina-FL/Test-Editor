const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class EmployeesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.create(
      {
        id: data.id || undefined,

        employee_name: data.employee_name || null,
        role: data.role || null,
        shift: data.shift || null,
        payroll: data.payroll || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await employees.setCompanies(data.companies || null, {
      transaction,
    });

    return employees;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const employeesData = data.map((item, index) => ({
      id: item.id || undefined,

      employee_name: item.employee_name || null,
      role: item.role || null,
      shift: item.shift || null,
      payroll: item.payroll || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const employees = await db.employees.bulkCreate(employeesData, {
      transaction,
    });

    // For each item created, replace relation files

    return employees;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const employees = await db.employees.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.employee_name !== undefined)
      updatePayload.employee_name = data.employee_name;

    if (data.role !== undefined) updatePayload.role = data.role;

    if (data.shift !== undefined) updatePayload.shift = data.shift;

    if (data.payroll !== undefined) updatePayload.payroll = data.payroll;

    updatePayload.updatedById = currentUser.id;

    await employees.update(updatePayload, { transaction });

    if (data.companies !== undefined) {
      await employees.setCompanies(
        data.companies,

        { transaction },
      );
    }

    return employees;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of employees) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of employees) {
        await record.destroy({ transaction });
      }
    });

    return employees;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.findByPk(id, options);

    await employees.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await employees.destroy({
      transaction,
    });

    return employees;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.findOne({ where }, { transaction });

    if (!employees) {
      return employees;
    }

    const output = employees.get({ plain: true });

    output.companies = await employees.getCompanies({
      transaction,
    });

    return output;
  }

  static async findAll(filter, globalAccess, options) {
    const limit = filter.limit || 0;
    let offset = 0;
    let where = {};
    const currentPage = +filter.page;

    const user = (options && options.currentUser) || null;
    const userCompanies = (user && user.companies?.id) || null;

    if (userCompanies) {
      if (options?.currentUser?.companiesId) {
        where.companiesId = options.currentUser.companiesId;
      }
    }

    offset = currentPage * limit;

    const orderBy = null;

    const transaction = (options && options.transaction) || undefined;

    let include = [
      {
        model: db.companies,
        as: 'companies',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.employee_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'employees',
            'employee_name',
            filter.employee_name,
          ),
        };
      }

      if (filter.role) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('employees', 'role', filter.role),
        };
      }

      if (filter.shift) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('employees', 'shift', filter.shift),
        };
      }

      if (filter.payrollRange) {
        const [start, end] = filter.payrollRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            payroll: {
              ...where.payroll,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            payroll: {
              ...where.payroll,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.companies) {
        const listItems = filter.companies.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          companiesId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    if (globalAccess) {
      delete where.companiesId;
    }

    const queryOptions = {
      where,
      include,
      distinct: true,
      order:
        filter.field && filter.sort
          ? [[filter.field, filter.sort]]
          : [['createdAt', 'desc']],
      transaction: options?.transaction,
      logging: console.log,
    };

    if (!options?.countOnly) {
      queryOptions.limit = limit ? Number(limit) : undefined;
      queryOptions.offset = offset ? Number(offset) : undefined;
    }

    try {
      const { rows, count } = await db.employees.findAndCountAll(queryOptions);

      return {
        rows: options?.countOnly ? [] : rows,
        count: count,
      };
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  static async findAllAutocomplete(
    query,
    limit,
    offset,
    globalAccess,
    organizationId,
  ) {
    let where = {};

    if (!globalAccess && organizationId) {
      where.organizationId = organizationId;
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('employees', 'employee_name', query),
        ],
      };
    }

    const records = await db.employees.findAll({
      attributes: ['id', 'employee_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['employee_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.employee_name,
    }));
  }
};
