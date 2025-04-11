import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import {
  update,
  fetch,
} from '../../stores/quality_controls/quality_controlsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditQuality_controls = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    check_name: '',

    work_order: null,

    check_date: new Date(),

    passed: false,

    companies: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { quality_controls } = useAppSelector(
    (state) => state.quality_controls,
  );

  const { currentUser } = useAppSelector((state) => state.auth);

  const { quality_controlsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: quality_controlsId }));
  }, [quality_controlsId]);

  useEffect(() => {
    if (typeof quality_controls === 'object') {
      setInitialValues(quality_controls);
    }
  }, [quality_controls]);

  useEffect(() => {
    if (typeof quality_controls === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = quality_controls[el]),
      );

      setInitialValues(newInitialVal);
    }
  }, [quality_controls]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: quality_controlsId, data }));
    await router.push('/quality_controls/quality_controls-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit quality_controls')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit quality_controls'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='CheckName'>
                <Field name='check_name' placeholder='CheckName' />
              </FormField>

              <FormField label='WorkOrder' labelFor='work_order'>
                <Field
                  name='work_order'
                  id='work_order'
                  component={SelectField}
                  options={initialValues.work_order}
                  itemRef={'work_orders'}
                  showField={'order_number'}
                ></Field>
              </FormField>

              <FormField label='CheckDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.check_date
                      ? new Date(
                          dayjs(initialValues.check_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, check_date: date })
                  }
                />
              </FormField>

              <FormField label='Passed' labelFor='passed'>
                <Field
                  name='passed'
                  id='passed'
                  component={SwitchField}
                ></Field>
              </FormField>

              <FormField label='companies' labelFor='companies'>
                <Field
                  name='companies'
                  id='companies'
                  component={SelectField}
                  options={initialValues.companies}
                  itemRef={'companies'}
                  showField={'name'}
                ></Field>
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() =>
                    router.push('/quality_controls/quality_controls-list')
                  }
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditQuality_controls.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_QUALITY_CONTROLS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditQuality_controls;
