import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/staff/staffSlice';
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

const StaffView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { staff } = useAppSelector((state) => state.staff);

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
        <title>{getPageTitle('View staff')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View staff')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/staff/staff-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>companies</p>

            <p>{staff?.companies?.name ?? 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Employee name</p>
            <p>{staff?.employee_name}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Clients Clients_manager</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Client name</th>

                      <th>Date registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.clients_clients_manager &&
                      Array.isArray(staff.clients_clients_manager) &&
                      staff.clients_clients_manager.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/clients/clients-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='client_name'>{item.client_name}</td>

                          <td data-label='date_registered'>
                            {dataFormatter.dateTimeFormatter(
                              item.date_registered,
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!staff?.clients_clients_manager?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/staff/staff-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

StaffView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_STAFF'}>{page}</LayoutAuthenticated>
  );
};

export default StaffView;
