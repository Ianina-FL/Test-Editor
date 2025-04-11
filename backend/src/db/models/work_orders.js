const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const work_orders = sequelize.define(
    'work_orders',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      order_number: {
        type: DataTypes.TEXT,
      },

      start_date: {
        type: DataTypes.DATE,
      },

      end_date: {
        type: DataTypes.DATE,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  work_orders.associate = (db) => {
    db.work_orders.belongsToMany(db.raw_materials, {
      as: 'raw_materials',
      foreignKey: {
        name: 'work_orders_raw_materialsId',
      },
      constraints: false,
      through: 'work_ordersRaw_materialsRaw_materials',
    });

    db.work_orders.belongsToMany(db.raw_materials, {
      as: 'raw_materials_filter',
      foreignKey: {
        name: 'work_orders_raw_materialsId',
      },
      constraints: false,
      through: 'work_ordersRaw_materialsRaw_materials',
    });

    db.work_orders.belongsToMany(db.machinery, {
      as: 'machinery',
      foreignKey: {
        name: 'work_orders_machineryId',
      },
      constraints: false,
      through: 'work_ordersMachineryMachinery',
    });

    db.work_orders.belongsToMany(db.machinery, {
      as: 'machinery_filter',
      foreignKey: {
        name: 'work_orders_machineryId',
      },
      constraints: false,
      through: 'work_ordersMachineryMachinery',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.work_orders.hasMany(db.quality_controls, {
      as: 'quality_controls_work_order',
      foreignKey: {
        name: 'work_orderId',
      },
      constraints: false,
    });

    //end loop

    db.work_orders.belongsTo(db.users, {
      as: 'production_manager',
      foreignKey: {
        name: 'production_managerId',
      },
      constraints: false,
    });

    db.work_orders.belongsTo(db.companies, {
      as: 'companies',
      foreignKey: {
        name: 'companiesId',
      },
      constraints: false,
    });

    db.work_orders.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.work_orders.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return work_orders;
};
