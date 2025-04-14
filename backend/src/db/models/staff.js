const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const staff = sequelize.define(
    'staff',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      employee_name: {
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

  staff.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.staff.hasMany(db.clients, {
      as: 'clients_clients_manager',
      foreignKey: {
        name: 'clients_managerId',
      },
      constraints: false,
    });

    //end loop

    db.staff.belongsTo(db.companies, {
      as: 'companies',
      foreignKey: {
        name: 'companiesId',
      },
      constraints: false,
    });

    db.staff.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.staff.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return staff;
};
