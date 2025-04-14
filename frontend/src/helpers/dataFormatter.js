import dayjs from 'dayjs';
import _ from 'lodash';

export default {
  filesFormatter(arr) {
    if (!arr || !arr.length) return [];
    return arr.map((item) => item);
  },
  imageFormatter(arr) {
    if (!arr || !arr.length) return [];
    return arr.map((item) => ({
      publicUrl: item.publicUrl || '',
    }));
  },
  oneImageFormatter(arr) {
    if (!arr || !arr.length) return '';
    return arr[0].publicUrl || '';
  },
  dateFormatter(date) {
    if (!date) return '';
    return dayjs(date).format('YYYY-MM-DD');
  },
  dateTimeFormatter(date) {
    if (!date) return '';
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  },
  booleanFormatter(val) {
    return val ? 'Yes' : 'No';
  },
  dataGridEditFormatter(obj) {
    return _.transform(obj, (result, value, key) => {
      if (_.isArray(value)) {
        result[key] = _.map(value, 'id');
      } else if (_.isObject(value)) {
        result[key] = value.id;
      } else {
        result[key] = value;
      }
    });
  },

  machineryManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.machine_name);
  },
  machineryOneListFormatter(val) {
    if (!val) return '';
    return val.machine_name;
  },
  machineryManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.machine_name };
    });
  },
  machineryOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.machine_name, id: val.id };
  },

  raw_materialsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.material_name);
  },
  raw_materialsOneListFormatter(val) {
    if (!val) return '';
    return val.material_name;
  },
  raw_materialsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.material_name };
    });
  },
  raw_materialsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.material_name, id: val.id };
  },

  suppliersManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.supplier_name);
  },
  suppliersOneListFormatter(val) {
    if (!val) return '';
    return val.supplier_name;
  },
  suppliersManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.supplier_name };
    });
  },
  suppliersOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.supplier_name, id: val.id };
  },

  work_ordersManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.order_number);
  },
  work_ordersOneListFormatter(val) {
    if (!val) return '';
    return val.order_number;
  },
  work_ordersManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.order_number };
    });
  },
  work_ordersOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.order_number, id: val.id };
  },

  rolesManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  rolesOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  rolesManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  rolesOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },

  permissionsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  permissionsOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  permissionsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  permissionsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },

  companiesManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  companiesOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  companiesManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  companiesOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },

  staffManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.employee_name);
  },
  staffOneListFormatter(val) {
    if (!val) return '';
    return val.employee_name;
  },
  staffManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.employee_name };
    });
  },
  staffOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.employee_name, id: val.id };
  },
};
