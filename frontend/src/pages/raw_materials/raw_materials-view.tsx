import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/raw_materials/raw_materialsSlice';
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

const Raw_materialsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { raw_materials } = useAppSelector((state) => state.raw_materials);

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
        <title>{getPageTitle('View raw_materials')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View raw_materials')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/raw_materials/raw_materials-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>MaterialName</p>
            <p>{raw_materials?.material_name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Quantity</p>
            <p>{raw_materials?.quantity || 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>ReorderLevel</p>
            <p>{raw_materials?.reorder_level || 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Suppliers</p>
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
                    {raw_materials.suppliers &&
                      Array.isArray(raw_materials.suppliers) &&
                      raw_materials.suppliers.map((item: any) => (
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
              {!raw_materials?.suppliers?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>companies</p>

            <p>{raw_materials?.companies?.name ?? 'No data'}</p>
          </div>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/raw_materials/raw_materials-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

Raw_materialsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_RAW_MATERIALS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default Raw_materialsView;
