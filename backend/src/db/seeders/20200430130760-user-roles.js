const { v4: uuid } = require('uuid');

module.exports = {
  /**
   * @param{import("sequelize").QueryInterface} queryInterface
   * @return {Promise<void>}
   */
  async up(queryInterface) {
    const createdAt = new Date();
    const updatedAt = new Date();

    /** @type {Map<string, string>} */
    const idMap = new Map();

    /**
     * @param {string} key
     * @return {string}
     */
    function getId(key) {
      if (idMap.has(key)) {
        return idMap.get(key);
      }
      const id = uuid();
      idMap.set(key, id);
      return id;
    }

    await queryInterface.bulkInsert('roles', [
      {
        id: getId('SuperAdmin'),
        name: 'Super Administrator',
        createdAt,
        updatedAt,
      },

      {
        id: getId('Administrator'),
        name: 'Administrator',
        createdAt,
        updatedAt,
      },

      {
        id: getId('ManufacturingAdmin'),
        name: 'Manufacturing Admin',
        createdAt,
        updatedAt,
      },

      {
        id: getId('ProductionManager'),
        name: 'Production Manager',
        createdAt,
        updatedAt,
      },

      {
        id: getId('InventoryManager'),
        name: 'Inventory Manager',
        createdAt,
        updatedAt,
      },

      {
        id: getId('QualityControlManager'),
        name: 'Quality Control Manager',
        createdAt,
        updatedAt,
      },

      {
        id: getId('SupplierCoordinator'),
        name: 'Supplier Coordinator',
        createdAt,
        updatedAt,
      },
    ]);

    /**
     * @param {string} name
     */
    function createPermissions(name) {
      return [
        {
          id: getId(`CREATE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `CREATE_${name.toUpperCase()}`,
        },
        {
          id: getId(`READ_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `READ_${name.toUpperCase()}`,
        },
        {
          id: getId(`UPDATE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `UPDATE_${name.toUpperCase()}`,
        },
        {
          id: getId(`DELETE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `DELETE_${name.toUpperCase()}`,
        },
      ];
    }

    const entities = [
      'users',
      'employees',
      'inventory',
      'machinery',
      'quality_controls',
      'raw_materials',
      'suppliers',
      'work_orders',
      'roles',
      'permissions',
      'companies',
      ,
    ];
    await queryInterface.bulkInsert(
      'permissions',
      entities.flatMap(createPermissions),
    );
    await queryInterface.bulkInsert('permissions', [
      {
        id: getId(`READ_API_DOCS`),
        createdAt,
        updatedAt,
        name: `READ_API_DOCS`,
      },
    ]);
    await queryInterface.bulkInsert('permissions', [
      {
        id: getId(`CREATE_SEARCH`),
        createdAt,
        updatedAt,
        name: `CREATE_SEARCH`,
      },
    ]);

    await queryInterface.bulkUpdate(
      'roles',
      { globalAccess: true },
      { id: getId('SuperAdmin') },
    );

    await queryInterface.sequelize
      .query(`create table "rolesPermissionsPermissions"
(
"createdAt"           timestamp with time zone not null,
"updatedAt"           timestamp with time zone not null,
"roles_permissionsId" uuid                     not null,
"permissionId"        uuid                     not null,
primary key ("roles_permissionsId", "permissionId")
);`);

    await queryInterface.bulkInsert('rolesPermissionsPermissions', [
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('CREATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProductionManager'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('InventoryManager'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('QualityControlManager'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupplierCoordinator'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('CREATE_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('READ_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('UPDATE_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('DELETE_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProductionManager'),
        permissionId: getId('READ_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('InventoryManager'),
        permissionId: getId('READ_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('QualityControlManager'),
        permissionId: getId('READ_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupplierCoordinator'),
        permissionId: getId('READ_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('CREATE_INVENTORY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('READ_INVENTORY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('UPDATE_INVENTORY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('DELETE_INVENTORY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProductionManager'),
        permissionId: getId('READ_INVENTORY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProductionManager'),
        permissionId: getId('UPDATE_INVENTORY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('InventoryManager'),
        permissionId: getId('CREATE_INVENTORY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('InventoryManager'),
        permissionId: getId('READ_INVENTORY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('InventoryManager'),
        permissionId: getId('UPDATE_INVENTORY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('InventoryManager'),
        permissionId: getId('DELETE_INVENTORY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('QualityControlManager'),
        permissionId: getId('READ_INVENTORY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupplierCoordinator'),
        permissionId: getId('READ_INVENTORY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('CREATE_MACHINERY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('READ_MACHINERY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('UPDATE_MACHINERY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('DELETE_MACHINERY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProductionManager'),
        permissionId: getId('READ_MACHINERY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProductionManager'),
        permissionId: getId('UPDATE_MACHINERY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('InventoryManager'),
        permissionId: getId('READ_MACHINERY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('QualityControlManager'),
        permissionId: getId('READ_MACHINERY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupplierCoordinator'),
        permissionId: getId('READ_MACHINERY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('CREATE_QUALITY_CONTROLS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('READ_QUALITY_CONTROLS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('UPDATE_QUALITY_CONTROLS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('DELETE_QUALITY_CONTROLS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProductionManager'),
        permissionId: getId('READ_QUALITY_CONTROLS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProductionManager'),
        permissionId: getId('UPDATE_QUALITY_CONTROLS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('InventoryManager'),
        permissionId: getId('READ_QUALITY_CONTROLS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('QualityControlManager'),
        permissionId: getId('CREATE_QUALITY_CONTROLS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('QualityControlManager'),
        permissionId: getId('READ_QUALITY_CONTROLS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('QualityControlManager'),
        permissionId: getId('UPDATE_QUALITY_CONTROLS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('QualityControlManager'),
        permissionId: getId('DELETE_QUALITY_CONTROLS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupplierCoordinator'),
        permissionId: getId('READ_QUALITY_CONTROLS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('CREATE_RAW_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('READ_RAW_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('UPDATE_RAW_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('DELETE_RAW_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProductionManager'),
        permissionId: getId('READ_RAW_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProductionManager'),
        permissionId: getId('UPDATE_RAW_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('InventoryManager'),
        permissionId: getId('CREATE_RAW_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('InventoryManager'),
        permissionId: getId('READ_RAW_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('InventoryManager'),
        permissionId: getId('UPDATE_RAW_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('QualityControlManager'),
        permissionId: getId('READ_RAW_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupplierCoordinator'),
        permissionId: getId('READ_RAW_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('CREATE_SUPPLIERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('READ_SUPPLIERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('UPDATE_SUPPLIERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('DELETE_SUPPLIERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProductionManager'),
        permissionId: getId('READ_SUPPLIERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('InventoryManager'),
        permissionId: getId('READ_SUPPLIERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('QualityControlManager'),
        permissionId: getId('READ_SUPPLIERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupplierCoordinator'),
        permissionId: getId('CREATE_SUPPLIERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupplierCoordinator'),
        permissionId: getId('READ_SUPPLIERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupplierCoordinator'),
        permissionId: getId('UPDATE_SUPPLIERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupplierCoordinator'),
        permissionId: getId('DELETE_SUPPLIERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('CREATE_WORK_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('READ_WORK_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('UPDATE_WORK_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('DELETE_WORK_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProductionManager'),
        permissionId: getId('CREATE_WORK_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProductionManager'),
        permissionId: getId('READ_WORK_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProductionManager'),
        permissionId: getId('UPDATE_WORK_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProductionManager'),
        permissionId: getId('DELETE_WORK_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('InventoryManager'),
        permissionId: getId('READ_WORK_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('QualityControlManager'),
        permissionId: getId('READ_WORK_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupplierCoordinator'),
        permissionId: getId('READ_WORK_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ManufacturingAdmin'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProductionManager'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('InventoryManager'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('QualityControlManager'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupplierCoordinator'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_EMPLOYEES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_EMPLOYEES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_EMPLOYEES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_INVENTORY'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_INVENTORY'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_INVENTORY'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_INVENTORY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_MACHINERY'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_MACHINERY'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_MACHINERY'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_MACHINERY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_QUALITY_CONTROLS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_QUALITY_CONTROLS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_QUALITY_CONTROLS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_QUALITY_CONTROLS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_RAW_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_RAW_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_RAW_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_RAW_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_SUPPLIERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_SUPPLIERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_SUPPLIERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_SUPPLIERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_WORK_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_WORK_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_WORK_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_WORK_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_EMPLOYEES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_EMPLOYEES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_EMPLOYEES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_INVENTORY'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_INVENTORY'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_INVENTORY'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_INVENTORY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_MACHINERY'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_MACHINERY'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_MACHINERY'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_MACHINERY'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_QUALITY_CONTROLS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_QUALITY_CONTROLS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_QUALITY_CONTROLS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_QUALITY_CONTROLS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_RAW_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_RAW_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_RAW_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_RAW_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_SUPPLIERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_SUPPLIERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_SUPPLIERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_SUPPLIERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_WORK_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_WORK_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_WORK_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_WORK_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_ROLES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_PERMISSIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_COMPANIES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_COMPANIES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_COMPANIES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_COMPANIES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_API_DOCS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_API_DOCS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_SEARCH'),
      },
    ]);

    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'SuperAdmin',
      )}' WHERE "email"='super_admin@flatlogic.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'Administrator',
      )}' WHERE "email"='admin@flatlogic.com'`,
    );

    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'ManufacturingAdmin',
      )}' WHERE "email"='client@hello.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'ProductionManager',
      )}' WHERE "email"='john@doe.com'`,
    );
  },
};
