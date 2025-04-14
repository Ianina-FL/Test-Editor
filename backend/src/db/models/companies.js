const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const companies = sequelize.define(
    'companies',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
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

  companies.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.companies.hasMany(db.users, {
      as: 'users_companies',
      foreignKey: {
        name: 'companiesId',
      },
      constraints: false,
    });

    db.companies.hasMany(db.employees, {
      as: 'employees_companies',
      foreignKey: {
        name: 'companiesId',
      },
      constraints: false,
    });

    db.companies.hasMany(db.inventory, {
      as: 'inventory_companies',
      foreignKey: {
        name: 'companiesId',
      },
      constraints: false,
    });

    db.companies.hasMany(db.machinery, {
      as: 'machinery_companies',
      foreignKey: {
        name: 'companiesId',
      },
      constraints: false,
    });

    db.companies.hasMany(db.quality_controls, {
      as: 'quality_controls_companies',
      foreignKey: {
        name: 'companiesId',
      },
      constraints: false,
    });

    db.companies.hasMany(db.raw_materials, {
      as: 'raw_materials_companies',
      foreignKey: {
        name: 'companiesId',
      },
      constraints: false,
    });

    db.companies.hasMany(db.suppliers, {
      as: 'suppliers_companies',
      foreignKey: {
        name: 'companiesId',
      },
      constraints: false,
    });

    db.companies.hasMany(db.work_orders, {
      as: 'work_orders_companies',
      foreignKey: {
        name: 'companiesId',
      },
      constraints: false,
    });

    db.companies.hasMany(db.staff, {
      as: 'staff_companies',
      foreignKey: {
        name: 'companiesId',
      },
      constraints: false,
    });

    db.companies.hasMany(db.clients, {
      as: 'clients_companies',
      foreignKey: {
        name: 'companiesId',
      },
      constraints: false,
    });

    //end loop

    db.companies.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.companies.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return companies;
};
