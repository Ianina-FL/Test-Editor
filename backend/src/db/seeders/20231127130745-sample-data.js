const db = require('../models');
const Users = db.users;

const Employees = db.employees;

const Inventory = db.inventory;

const Machinery = db.machinery;

const QualityControls = db.quality_controls;

const RawMaterials = db.raw_materials;

const Suppliers = db.suppliers;

const WorkOrders = db.work_orders;

const Companies = db.companies;

const Staff = db.staff;

const Clients = db.clients;

const EmployeesData = [
  {
    employee_name: 'John Doe',

    role: 'Operator',

    shift: 'Day',

    payroll: 45000,

    // type code here for "relation_one" field
  },

  {
    employee_name: 'Alice Smith',

    role: 'Supervisor',

    shift: 'Night',

    payroll: 55000,

    // type code here for "relation_one" field
  },

  {
    employee_name: 'Bob White',

    role: 'Technician',

    shift: 'Day',

    payroll: 48000,

    // type code here for "relation_one" field
  },
];

const InventoryData = [
  {
    item_name: 'Steel Beams',

    quantity: 150,

    status: 'available',

    // type code here for "relation_one" field
  },

  {
    item_name: 'Aluminum Sheets',

    quantity: 75,

    status: 'returned',

    // type code here for "relation_one" field
  },

  {
    item_name: 'Copper Wires',

    quantity: 200,

    status: 'available',

    // type code here for "relation_one" field
  },
];

const MachineryData = [
  {
    machine_name: 'Lathe',

    maintenance_schedule: 'Monthly',

    last_maintenance_date: new Date('2023-09-01T00:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    machine_name: 'CNC',

    maintenance_schedule: 'Quarterly',

    last_maintenance_date: new Date('2023-07-01T00:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    machine_name: 'Injection Molder',

    maintenance_schedule: 'Monthly',

    last_maintenance_date: new Date('2023-09-15T00:00:00Z'),

    // type code here for "relation_one" field
  },
];

const QualityControlsData = [
  {
    check_name: 'Initial Inspection',

    // type code here for "relation_one" field

    check_date: new Date('2023-10-02T10:00:00Z'),

    passed: true,

    // type code here for "relation_one" field
  },

  {
    check_name: 'Mid-Production Check',

    // type code here for "relation_one" field

    check_date: new Date('2023-10-07T14:00:00Z'),

    passed: true,

    // type code here for "relation_one" field
  },

  {
    check_name: 'Final Inspection',

    // type code here for "relation_one" field

    check_date: new Date('2023-10-12T16:00:00Z'),

    passed: false,

    // type code here for "relation_one" field
  },
];

const RawMaterialsData = [
  {
    material_name: 'Steel',

    quantity: 1000,

    reorder_level: 200,

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    material_name: 'Aluminum',

    quantity: 500,

    reorder_level: 100,

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    material_name: 'Copper',

    quantity: 300,

    reorder_level: 50,

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },
];

const SuppliersData = [
  {
    supplier_name: 'SteelSupplies',

    contact_info: 'contact@steelsupplies.com',

    contract_terms: 'Annual contract with quarterly reviews.',

    // type code here for "relation_one" field
  },

  {
    supplier_name: 'MetalWorks',

    contact_info: 'info@metalworks.com',

    contract_terms: 'Bi-annual contract with monthly deliveries.',

    // type code here for "relation_one" field
  },

  {
    supplier_name: 'CopperCo',

    contact_info: 'sales@copperco.com',

    contract_terms: 'Flexible contract with on-demand orders.',

    // type code here for "relation_one" field
  },
];

const WorkOrdersData = [
  {
    order_number: 'WO-001',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    start_date: new Date('2023-10-01T08:00:00Z'),

    end_date: new Date('2023-10-05T17:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    order_number: 'WO-002',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    start_date: new Date('2023-10-06T08:00:00Z'),

    end_date: new Date('2023-10-10T17:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    order_number: 'WO-003',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    start_date: new Date('2023-10-11T08:00:00Z'),

    end_date: new Date('2023-10-15T17:00:00Z'),

    // type code here for "relation_one" field
  },
];

const CompaniesData = [
  {
    name: 'TechCorp',
  },

  {
    name: 'BuildIt',
  },

  {
    name: 'CraftWorks',
  },
];

const StaffData = [
  {
    // type code here for "relation_one" field

    employee_name: 'Dmitri Mendeleev',
  },

  {
    // type code here for "relation_one" field

    employee_name: 'August Kekule',
  },

  {
    // type code here for "relation_one" field

    employee_name: 'Carl Linnaeus',
  },
];

const ClientsData = [
  {
    // type code here for "relation_one" field

    client_name: 'Louis Pasteur',

    date_registered: new Date(Date.now()),

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    client_name: 'Robert Koch',

    date_registered: new Date(Date.now()),

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    client_name: 'Euclid',

    date_registered: new Date(Date.now()),

    // type code here for "relation_one" field
  },
];

// Similar logic for "relation_many"

async function associateUserWithCompany() {
  const relatedCompany0 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const User0 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (User0?.setCompany) {
    await User0.setCompany(relatedCompany0);
  }

  const relatedCompany1 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const User1 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (User1?.setCompany) {
    await User1.setCompany(relatedCompany1);
  }

  const relatedCompany2 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const User2 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (User2?.setCompany) {
    await User2.setCompany(relatedCompany2);
  }
}

async function associateEmployeeWithCompany() {
  const relatedCompany0 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Employee0 = await Employees.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Employee0?.setCompany) {
    await Employee0.setCompany(relatedCompany0);
  }

  const relatedCompany1 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Employee1 = await Employees.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Employee1?.setCompany) {
    await Employee1.setCompany(relatedCompany1);
  }

  const relatedCompany2 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Employee2 = await Employees.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Employee2?.setCompany) {
    await Employee2.setCompany(relatedCompany2);
  }
}

async function associateInventoryWithCompany() {
  const relatedCompany0 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Inventory0 = await Inventory.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Inventory0?.setCompany) {
    await Inventory0.setCompany(relatedCompany0);
  }

  const relatedCompany1 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Inventory1 = await Inventory.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Inventory1?.setCompany) {
    await Inventory1.setCompany(relatedCompany1);
  }

  const relatedCompany2 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Inventory2 = await Inventory.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Inventory2?.setCompany) {
    await Inventory2.setCompany(relatedCompany2);
  }
}

async function associateMachineryWithCompany() {
  const relatedCompany0 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Machinery0 = await Machinery.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Machinery0?.setCompany) {
    await Machinery0.setCompany(relatedCompany0);
  }

  const relatedCompany1 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Machinery1 = await Machinery.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Machinery1?.setCompany) {
    await Machinery1.setCompany(relatedCompany1);
  }

  const relatedCompany2 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Machinery2 = await Machinery.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Machinery2?.setCompany) {
    await Machinery2.setCompany(relatedCompany2);
  }
}

async function associateQualityControlWithWork_order() {
  const relatedWork_order0 = await WorkOrders.findOne({
    offset: Math.floor(Math.random() * (await WorkOrders.count())),
  });
  const QualityControl0 = await QualityControls.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (QualityControl0?.setWork_order) {
    await QualityControl0.setWork_order(relatedWork_order0);
  }

  const relatedWork_order1 = await WorkOrders.findOne({
    offset: Math.floor(Math.random() * (await WorkOrders.count())),
  });
  const QualityControl1 = await QualityControls.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (QualityControl1?.setWork_order) {
    await QualityControl1.setWork_order(relatedWork_order1);
  }

  const relatedWork_order2 = await WorkOrders.findOne({
    offset: Math.floor(Math.random() * (await WorkOrders.count())),
  });
  const QualityControl2 = await QualityControls.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (QualityControl2?.setWork_order) {
    await QualityControl2.setWork_order(relatedWork_order2);
  }
}

async function associateQualityControlWithCompany() {
  const relatedCompany0 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const QualityControl0 = await QualityControls.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (QualityControl0?.setCompany) {
    await QualityControl0.setCompany(relatedCompany0);
  }

  const relatedCompany1 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const QualityControl1 = await QualityControls.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (QualityControl1?.setCompany) {
    await QualityControl1.setCompany(relatedCompany1);
  }

  const relatedCompany2 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const QualityControl2 = await QualityControls.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (QualityControl2?.setCompany) {
    await QualityControl2.setCompany(relatedCompany2);
  }
}

// Similar logic for "relation_many"

async function associateRawMaterialWithCompany() {
  const relatedCompany0 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const RawMaterial0 = await RawMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (RawMaterial0?.setCompany) {
    await RawMaterial0.setCompany(relatedCompany0);
  }

  const relatedCompany1 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const RawMaterial1 = await RawMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (RawMaterial1?.setCompany) {
    await RawMaterial1.setCompany(relatedCompany1);
  }

  const relatedCompany2 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const RawMaterial2 = await RawMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (RawMaterial2?.setCompany) {
    await RawMaterial2.setCompany(relatedCompany2);
  }
}

async function associateSupplierWithCompany() {
  const relatedCompany0 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Supplier0 = await Suppliers.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Supplier0?.setCompany) {
    await Supplier0.setCompany(relatedCompany0);
  }

  const relatedCompany1 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Supplier1 = await Suppliers.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Supplier1?.setCompany) {
    await Supplier1.setCompany(relatedCompany1);
  }

  const relatedCompany2 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Supplier2 = await Suppliers.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Supplier2?.setCompany) {
    await Supplier2.setCompany(relatedCompany2);
  }
}

// Similar logic for "relation_many"

// Similar logic for "relation_many"

async function associateWorkOrderWithCompany() {
  const relatedCompany0 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const WorkOrder0 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (WorkOrder0?.setCompany) {
    await WorkOrder0.setCompany(relatedCompany0);
  }

  const relatedCompany1 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const WorkOrder1 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (WorkOrder1?.setCompany) {
    await WorkOrder1.setCompany(relatedCompany1);
  }

  const relatedCompany2 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const WorkOrder2 = await WorkOrders.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (WorkOrder2?.setCompany) {
    await WorkOrder2.setCompany(relatedCompany2);
  }
}

async function associateStaffWithCompany() {
  const relatedCompany0 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Staff0 = await Staff.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Staff0?.setCompany) {
    await Staff0.setCompany(relatedCompany0);
  }

  const relatedCompany1 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Staff1 = await Staff.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Staff1?.setCompany) {
    await Staff1.setCompany(relatedCompany1);
  }

  const relatedCompany2 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Staff2 = await Staff.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Staff2?.setCompany) {
    await Staff2.setCompany(relatedCompany2);
  }
}

async function associateClientWithCompany() {
  const relatedCompany0 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Client0 = await Clients.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Client0?.setCompany) {
    await Client0.setCompany(relatedCompany0);
  }

  const relatedCompany1 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Client1 = await Clients.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Client1?.setCompany) {
    await Client1.setCompany(relatedCompany1);
  }

  const relatedCompany2 = await Companies.findOne({
    offset: Math.floor(Math.random() * (await Companies.count())),
  });
  const Client2 = await Clients.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Client2?.setCompany) {
    await Client2.setCompany(relatedCompany2);
  }
}

async function associateClientWithClients_manager() {
  const relatedClients_manager0 = await Staff.findOne({
    offset: Math.floor(Math.random() * (await Staff.count())),
  });
  const Client0 = await Clients.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Client0?.setClients_manager) {
    await Client0.setClients_manager(relatedClients_manager0);
  }

  const relatedClients_manager1 = await Staff.findOne({
    offset: Math.floor(Math.random() * (await Staff.count())),
  });
  const Client1 = await Clients.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Client1?.setClients_manager) {
    await Client1.setClients_manager(relatedClients_manager1);
  }

  const relatedClients_manager2 = await Staff.findOne({
    offset: Math.floor(Math.random() * (await Staff.count())),
  });
  const Client2 = await Clients.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Client2?.setClients_manager) {
    await Client2.setClients_manager(relatedClients_manager2);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Employees.bulkCreate(EmployeesData);

    await Inventory.bulkCreate(InventoryData);

    await Machinery.bulkCreate(MachineryData);

    await QualityControls.bulkCreate(QualityControlsData);

    await RawMaterials.bulkCreate(RawMaterialsData);

    await Suppliers.bulkCreate(SuppliersData);

    await WorkOrders.bulkCreate(WorkOrdersData);

    await Companies.bulkCreate(CompaniesData);

    await Staff.bulkCreate(StaffData);

    await Clients.bulkCreate(ClientsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateUserWithCompany(),

      await associateEmployeeWithCompany(),

      await associateInventoryWithCompany(),

      await associateMachineryWithCompany(),

      await associateQualityControlWithWork_order(),

      await associateQualityControlWithCompany(),

      // Similar logic for "relation_many"

      await associateRawMaterialWithCompany(),

      await associateSupplierWithCompany(),

      // Similar logic for "relation_many"

      // Similar logic for "relation_many"

      await associateWorkOrderWithCompany(),

      await associateStaffWithCompany(),

      await associateClientWithCompany(),

      await associateClientWithClients_manager(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('employees', null, {});

    await queryInterface.bulkDelete('inventory', null, {});

    await queryInterface.bulkDelete('machinery', null, {});

    await queryInterface.bulkDelete('quality_controls', null, {});

    await queryInterface.bulkDelete('raw_materials', null, {});

    await queryInterface.bulkDelete('suppliers', null, {});

    await queryInterface.bulkDelete('work_orders', null, {});

    await queryInterface.bulkDelete('companies', null, {});

    await queryInterface.bulkDelete('staff', null, {});

    await queryInterface.bulkDelete('clients', null, {});
  },
};
