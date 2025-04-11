const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Raw_materialsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const raw_materials = await db.raw_materials.create(
      {
        id: data.id || undefined,

        material_name: data.material_name || null,
        quantity: data.quantity || null,
        reorder_level: data.reorder_level || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await raw_materials.setCompanies(data.companies || null, {
      transaction,
    });

    await raw_materials.setSuppliers(data.suppliers || [], {
      transaction,
    });

    return raw_materials;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const raw_materialsData = data.map((item, index) => ({
      id: item.id || undefined,

      material_name: item.material_name || null,
      quantity: item.quantity || null,
      reorder_level: item.reorder_level || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const raw_materials = await db.raw_materials.bulkCreate(raw_materialsData, {
      transaction,
    });

    // For each item created, replace relation files

    return raw_materials;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const raw_materials = await db.raw_materials.findByPk(
      id,
      {},
      { transaction },
    );

    const updatePayload = {};

    if (data.material_name !== undefined)
      updatePayload.material_name = data.material_name;

    if (data.quantity !== undefined) updatePayload.quantity = data.quantity;

    if (data.reorder_level !== undefined)
      updatePayload.reorder_level = data.reorder_level;

    updatePayload.updatedById = currentUser.id;

    await raw_materials.update(updatePayload, { transaction });

    if (data.companies !== undefined) {
      await raw_materials.setCompanies(
        data.companies,

        { transaction },
      );
    }

    if (data.suppliers !== undefined) {
      await raw_materials.setSuppliers(data.suppliers, { transaction });
    }

    return raw_materials;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const raw_materials = await db.raw_materials.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of raw_materials) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of raw_materials) {
        await record.destroy({ transaction });
      }
    });

    return raw_materials;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const raw_materials = await db.raw_materials.findByPk(id, options);

    await raw_materials.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await raw_materials.destroy({
      transaction,
    });

    return raw_materials;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const raw_materials = await db.raw_materials.findOne(
      { where },
      { transaction },
    );

    if (!raw_materials) {
      return raw_materials;
    }

    const output = raw_materials.get({ plain: true });

    output.suppliers = await raw_materials.getSuppliers({
      transaction,
    });

    output.companies = await raw_materials.getCompanies({
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
        model: db.suppliers,
        as: 'suppliers',
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

      if (filter.material_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'raw_materials',
            'material_name',
            filter.material_name,
          ),
        };
      }

      if (filter.quantityRange) {
        const [start, end] = filter.quantityRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            quantity: {
              ...where.quantity,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            quantity: {
              ...where.quantity,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.reorder_levelRange) {
        const [start, end] = filter.reorder_levelRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            reorder_level: {
              ...where.reorder_level,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            reorder_level: {
              ...where.reorder_level,
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

      if (filter.suppliers) {
        const searchTerms = filter.suppliers.split('|');

        include = [
          {
            model: db.suppliers,
            as: 'suppliers_filter',
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
                        supplier_name: {
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
      const { rows, count } = await db.raw_materials.findAndCountAll(
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
          Utils.ilike('raw_materials', 'material_name', query),
        ],
      };
    }

    const records = await db.raw_materials.findAll({
      attributes: ['id', 'material_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['material_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.material_name,
    }));
  }
};
