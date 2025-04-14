const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ClientsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const clients = await db.clients.create(
      {
        id: data.id || undefined,

        client_name: data.client_name || null,
        date_registered: data.date_registered || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await clients.setCompanies(data.companies || null, {
      transaction,
    });

    await clients.setClients_manager(data.clients_manager || null, {
      transaction,
    });

    return clients;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const clientsData = data.map((item, index) => ({
      id: item.id || undefined,

      client_name: item.client_name || null,
      date_registered: item.date_registered || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const clients = await db.clients.bulkCreate(clientsData, { transaction });

    // For each item created, replace relation files

    return clients;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const clients = await db.clients.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.client_name !== undefined)
      updatePayload.client_name = data.client_name;

    if (data.date_registered !== undefined)
      updatePayload.date_registered = data.date_registered;

    updatePayload.updatedById = currentUser.id;

    await clients.update(updatePayload, { transaction });

    if (data.companies !== undefined) {
      await clients.setCompanies(
        data.companies,

        { transaction },
      );
    }

    if (data.clients_manager !== undefined) {
      await clients.setClients_manager(
        data.clients_manager,

        { transaction },
      );
    }

    return clients;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const clients = await db.clients.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of clients) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of clients) {
        await record.destroy({ transaction });
      }
    });

    return clients;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const clients = await db.clients.findByPk(id, options);

    await clients.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await clients.destroy({
      transaction,
    });

    return clients;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const clients = await db.clients.findOne({ where }, { transaction });

    if (!clients) {
      return clients;
    }

    const output = clients.get({ plain: true });

    output.companies = await clients.getCompanies({
      transaction,
    });

    output.clients_manager = await clients.getClients_manager({
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

      {
        model: db.staff,
        as: 'clients_manager',

        where: filter.clients_manager
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.clients_manager
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  employee_name: {
                    [Op.or]: filter.clients_manager
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.client_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('clients', 'client_name', filter.client_name),
        };
      }

      if (filter.date_registeredRange) {
        const [start, end] = filter.date_registeredRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            date_registered: {
              ...where.date_registered,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            date_registered: {
              ...where.date_registered,
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
      const { rows, count } = await db.clients.findAndCountAll(queryOptions);

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
          Utils.ilike('clients', 'date_registered', query),
        ],
      };
    }

    const records = await db.clients.findAll({
      attributes: ['id', 'date_registered'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['date_registered', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.date_registered,
    }));
  }
};
