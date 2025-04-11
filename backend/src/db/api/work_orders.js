const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Work_ordersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const work_orders = await db.work_orders.create(
      {
        id: data.id || undefined,

        order_number: data.order_number || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await work_orders.setProduction_manager(data.production_manager || null, {
      transaction,
    });

    await work_orders.setCompanies(data.companies || null, {
      transaction,
    });

    await work_orders.setRaw_materials(data.raw_materials || [], {
      transaction,
    });

    await work_orders.setMachinery(data.machinery || [], {
      transaction,
    });

    return work_orders;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const work_ordersData = data.map((item, index) => ({
      id: item.id || undefined,

      order_number: item.order_number || null,
      start_date: item.start_date || null,
      end_date: item.end_date || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const work_orders = await db.work_orders.bulkCreate(work_ordersData, {
      transaction,
    });

    // For each item created, replace relation files

    return work_orders;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const work_orders = await db.work_orders.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.order_number !== undefined)
      updatePayload.order_number = data.order_number;

    if (data.start_date !== undefined)
      updatePayload.start_date = data.start_date;

    if (data.end_date !== undefined) updatePayload.end_date = data.end_date;

    updatePayload.updatedById = currentUser.id;

    await work_orders.update(updatePayload, { transaction });

    if (data.production_manager !== undefined) {
      await work_orders.setProduction_manager(
        data.production_manager,

        { transaction },
      );
    }

    if (data.companies !== undefined) {
      await work_orders.setCompanies(
        data.companies,

        { transaction },
      );
    }

    if (data.raw_materials !== undefined) {
      await work_orders.setRaw_materials(data.raw_materials, { transaction });
    }

    if (data.machinery !== undefined) {
      await work_orders.setMachinery(data.machinery, { transaction });
    }

    return work_orders;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const work_orders = await db.work_orders.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of work_orders) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of work_orders) {
        await record.destroy({ transaction });
      }
    });

    return work_orders;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const work_orders = await db.work_orders.findByPk(id, options);

    await work_orders.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await work_orders.destroy({
      transaction,
    });

    return work_orders;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const work_orders = await db.work_orders.findOne(
      { where },
      { transaction },
    );

    if (!work_orders) {
      return work_orders;
    }

    const output = work_orders.get({ plain: true });

    output.quality_controls_work_order =
      await work_orders.getQuality_controls_work_order({
        transaction,
      });

    output.production_manager = await work_orders.getProduction_manager({
      transaction,
    });

    output.raw_materials = await work_orders.getRaw_materials({
      transaction,
    });

    output.machinery = await work_orders.getMachinery({
      transaction,
    });

    output.companies = await work_orders.getCompanies({
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
        model: db.users,
        as: 'production_manager',

        where: filter.production_manager
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.production_manager
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  firstName: {
                    [Op.or]: filter.production_manager
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

      {
        model: db.raw_materials,
        as: 'raw_materials',
        required: false,
      },

      {
        model: db.machinery,
        as: 'machinery',
        required: false,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.order_number) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'work_orders',
            'order_number',
            filter.order_number,
          ),
        };
      }

      if (filter.calendarStart && filter.calendarEnd) {
        where = {
          ...where,
          [Op.or]: [
            {
              start_date: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
            {
              end_date: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
          ],
        };
      }

      if (filter.start_dateRange) {
        const [start, end] = filter.start_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            start_date: {
              ...where.start_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            start_date: {
              ...where.start_date,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.end_dateRange) {
        const [start, end] = filter.end_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            end_date: {
              ...where.end_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            end_date: {
              ...where.end_date,
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

      if (filter.raw_materials) {
        const searchTerms = filter.raw_materials.split('|');

        include = [
          {
            model: db.raw_materials,
            as: 'raw_materials_filter',
            required: searchTerms.length > 0,
            where:
              searchTerms.length > 0
                ? {
                    [Op.or]: [
                      {
                        id: {
                          [Op.in]: searchTerms.map((term) => Utils.uuid(term)),
                        },
                      },
                      {
                        material_name: {
                          [Op.or]: searchTerms.map((term) => ({
                            [Op.iLike]: `%${term}%`,
                          })),
                        },
                      },
                    ],
                  }
                : undefined,
          },
          ...include,
        ];
      }

      if (filter.machinery) {
        const searchTerms = filter.machinery.split('|');

        include = [
          {
            model: db.machinery,
            as: 'machinery_filter',
            required: searchTerms.length > 0,
            where:
              searchTerms.length > 0
                ? {
                    [Op.or]: [
                      {
                        id: {
                          [Op.in]: searchTerms.map((term) => Utils.uuid(term)),
                        },
                      },
                      {
                        machine_name: {
                          [Op.or]: searchTerms.map((term) => ({
                            [Op.iLike]: `%${term}%`,
                          })),
                        },
                      },
                    ],
                  }
                : undefined,
          },
          ...include,
        ];
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
      const { rows, count } = await db.work_orders.findAndCountAll(
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
          Utils.ilike('work_orders', 'order_number', query),
        ],
      };
    }

    const records = await db.work_orders.findAll({
      attributes: ['id', 'order_number'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['order_number', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.order_number,
    }));
  }
};
