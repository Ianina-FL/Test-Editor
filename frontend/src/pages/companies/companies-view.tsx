import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/companies/companiesSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

import { hasPermission } from '../../helpers/userPermissions';

const CompaniesView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { companies } = useAppSelector((state) => state.companies);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View companies')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View companies')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/companies/companies-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Name</p>
            <p>{companies?.name}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Users Companies</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>First Name</th>

                      <th>Last Name</th>

                      <th>Phone Number</th>

                      <th>E-Mail</th>

                      <th>Disabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.users_companies &&
                      Array.isArray(companies.users_companies) &&
                      companies.users_companies.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/users/users-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='firstName'>{item.firstName}</td>

                          <td data-label='lastName'>{item.lastName}</td>

                          <td data-label='phoneNumber'>{item.phoneNumber}</td>

                          <td data-label='email'>{item.email}</td>

                          <td data-label='disabled'>
                            {dataFormatter.booleanFormatter(item.disabled)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!companies?.users_companies?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Employees companies</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>EmployeeName</th>

                      <th>Role</th>

                      <th>Shift</th>

                      <th>Payroll</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.employees_companies &&
                      Array.isArray(companies.employees_companies) &&
                      companies.employees_companies.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/employees/employees-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='employee_name'>
                            {item.employee_name}
                          </td>

                          <td data-label='role'>{item.role}</td>

                          <td data-label='shift'>{item.shift}</td>

                          <td data-label='payroll'>{item.payroll}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!companies?.employees_companies?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Inventory companies</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>ItemName</th>

                      <th>Quantity</th>

                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.inventory_companies &&
                      Array.isArray(companies.inventory_companies) &&
                      companies.inventory_companies.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/inventory/inventory-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='item_name'>{item.item_name}</td>

                          <td data-label='quantity'>{item.quantity}</td>

                          <td data-label='status'>{item.status}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!companies?.inventory_companies?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Machinery companies</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>MachineName</th>

                      <th>MaintenanceSchedule</th>

                      <th>LastMaintenanceDate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.machinery_companies &&
                      Array.isArray(companies.machinery_companies) &&
                      companies.machinery_companies.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/machinery/machinery-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='machine_name'>{item.machine_name}</td>

                          <td data-label='maintenance_schedule'>
                            {item.maintenance_schedule}
                          </td>

                          <td data-label='last_maintenance_date'>
                            {dataFormatter.dateTimeFormatter(
                              item.last_maintenance_date,
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!companies?.machinery_companies?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Quality_controls companies</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>CheckName</th>

                      <th>CheckDate</th>

                      <th>Passed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.quality_controls_companies &&
                      Array.isArray(companies.quality_controls_companies) &&
                      companies.quality_controls_companies.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/quality_controls/quality_controls-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='check_name'>{item.check_name}</td>

                          <td data-label='check_date'>
                            {dataFormatter.dateTimeFormatter(item.check_date)}
                          </td>

                          <td data-label='passed'>
                            {dataFormatter.booleanFormatter(item.passed)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!companies?.quality_controls_companies?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Raw_materials companies</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>MaterialName</th>

                      <th>Quantity</th>

                      <th>ReorderLevel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.raw_materials_companies &&
                      Array.isArray(companies.raw_materials_companies) &&
                      companies.raw_materials_companies.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/raw_materials/raw_materials-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='material_name'>
                            {item.material_name}
                          </td>

                          <td data-label='quantity'>{item.quantity}</td>

                          <td data-label='reorder_level'>
                            {item.reorder_level}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!companies?.raw_materials_companies?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Suppliers companies</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>SupplierName</th>

                      <th>ContactInfo</th>

                      <th>ContractTerms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.suppliers_companies &&
                      Array.isArray(companies.suppliers_companies) &&
                      companies.suppliers_companies.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/suppliers/suppliers-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='supplier_name'>
                            {item.supplier_name}
                          </td>

                          <td data-label='contact_info'>{item.contact_info}</td>

                          <td data-label='contract_terms'>
                            {item.contract_terms}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!companies?.suppliers_companies?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Work_orders companies</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>OrderNumber</th>

                      <th>StartDate</th>

                      <th>EndDate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.work_orders_companies &&
                      Array.isArray(companies.work_orders_companies) &&
                      companies.work_orders_companies.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/work_orders/work_orders-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='order_number'>{item.order_number}</td>

                          <td data-label='start_date'>
                            {dataFormatter.dateTimeFormatter(item.start_date)}
                          </td>

                          <td data-label='end_date'>
                            {dataFormatter.dateTimeFormatter(item.end_date)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!companies?.work_orders_companies?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/companies/companies-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

CompaniesView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_COMPANIES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default CompaniesView;
