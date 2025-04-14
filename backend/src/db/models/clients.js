const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const clients = sequelize.define(
    'clients',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      client_name: {
        type: DataTypes.TEXT,
      },

      date_registered: {
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

  clients.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.clients.belongsTo(db.companies, {
      as: 'companies',
      foreignKey: {
        name: 'companiesId',
      },
      constraints: false,
    });

    db.clients.belongsTo(db.staff, {
      as: 'clients_manager',
      foreignKey: {
        name: 'clients_managerId',
      },
      constraints: false,
    });

    db.clients.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.clients.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return clients;
};
