import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/suppliers/suppliersSlice';
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

const SuppliersView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { suppliers } = useAppSelector((state) => state.suppliers);

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
        <title>{getPageTitle('View suppliers')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View suppliers')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/suppliers/suppliers-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>SupplierName</p>
            <p>{suppliers?.supplier_name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>ContactInfo</p>
            <p>{suppliers?.contact_info}</p>
          </div>

          <FormField label='Multi Text' hasTextareaHeight>
            <textarea
              className={'w-full'}
              disabled
              value={suppliers?.contract_terms}
            />
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>companies</p>

            <p>{suppliers?.companies?.name ?? 'No data'}</p>
          </div>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/suppliers/suppliers-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

SuppliersView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_SUPPLIERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default SuppliersView;
