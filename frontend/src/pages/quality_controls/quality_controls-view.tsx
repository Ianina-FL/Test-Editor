import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/quality_controls/quality_controlsSlice';
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

const Quality_controlsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { quality_controls } = useAppSelector(
    (state) => state.quality_controls,
  );

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
        <title>{getPageTitle('View quality_controls')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View quality_controls')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/quality_controls/quality_controls-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>CheckName</p>
            <p>{quality_controls?.check_name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>WorkOrder</p>

            <p>{quality_controls?.work_order?.order_number ?? 'No data'}</p>
          </div>

          <FormField label='CheckDate'>
            {quality_controls.check_date ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  quality_controls.check_date
                    ? new Date(
                        dayjs(quality_controls.check_date).format(
                          'YYYY-MM-DD hh:mm',
                        ),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No CheckDate</p>
            )}
          </FormField>

          <FormField label='Passed'>
            <SwitchField
              field={{ name: 'passed', value: quality_controls?.passed }}
              form={{ setFieldValue: () => null }}
              disabled
            />
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>companies</p>

            <p>{quality_controls?.companies?.name ?? 'No data'}</p>
          </div>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() =>
              router.push('/quality_controls/quality_controls-list')
            }
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

Quality_controlsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_QUALITY_CONTROLS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default Quality_controlsView;
