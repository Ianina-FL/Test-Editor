const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Quality_controlsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const quality_controls = await db.quality_controls.create(
      {
        id: data.id || undefined,

        check_name: data.check_name || null,
        check_date: data.check_date || null,
        passed: data.passed || false,

        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await quality_controls.setWork_order(data.work_order || null, {
      transaction,
    });

    await quality_controls.setCompanies(data.companies || null, {
      transaction,
    });

    return quality_controls;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const quality_controlsData = data.map((item, index) => ({
      id: item.id || undefined,

      check_name: item.check_name || null,
      check_date: item.check_date || null,
      passed: item.passed || false,

      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const quality_controls = await db.quality_controls.bulkCreate(
      quality_controlsData,
      { transaction },
    );

    // For each item created, replace relation files

    return quality_controls;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const quality_controls = await db.quality_controls.findByPk(
      id,
      {},
      { transaction },
    );

    const updatePayload = {};

    if (data.check_name !== undefined)
      updatePayload.check_name = data.check_name;

    if (data.check_date !== undefined)
      updatePayload.check_date = data.check_date;

    if (data.passed !== undefined) updatePayload.passed = data.passed;

    updatePayload.updatedById = currentUser.id;

    await quality_controls.update(updatePayload, { transaction });

    if (data.work_order !== undefined) {
      await quality_controls.setWork_order(
        data.work_order,

        { transaction },
      );
    }

    if (data.companies !== undefined) {
      await quality_controls.setCompanies(
        data.companies,

        { transaction },
      );
    }

    return quality_controls;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const quality_controls = await db.quality_controls.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of quality_controls) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of quality_controls) {
        await record.destroy({ transaction });
      }
    });

    return quality_controls;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const quality_controls = await db.quality_controls.findByPk(id, options);

    await quality_controls.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await quality_controls.destroy({
      transaction,
    });

    return quality_controls;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const quality_controls = await db.quality_controls.findOne(
      { where },
      { transaction },
    );

    if (!quality_controls) {
      return quality_controls;
    }

    const output = quality_controls.get({ plain: true });

    output.work_order = await quality_controls.getWork_order({
      transaction,
    });

    output.companies = await quality_controls.getCompanies({
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
        model: db.work_orders,
        as: 'work_order',

        where: filter.work_order
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.work_order
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  order_number: {
                    [Op.or]: filter.work_order
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },

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

      if (filter.check_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'quality_controls',
            'check_name',
            filter.check_name,
          ),
        };
      }

      if (filter.check_dateRange) {
        const [start, end] = filter.check_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            check_date: {
              ...where.check_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            check_date: {
              ...where.check_date,
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

      if (filter.passed) {
        where = {
          ...where,
          passed: filter.passed,
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
      const { rows, count } = await db.quality_controls.findAndCountAll(
        queryOptions,
      );

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
          Utils.ilike('quality_controls', 'check_name', query),
        ],
      };
    }

    const records = await db.quality_controls.findAll({
      attributes: ['id', 'check_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['check_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.check_name,
    }));
  }
};
