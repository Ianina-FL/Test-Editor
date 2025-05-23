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

import { update, fetch } from '../../stores/employees/employeesSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditEmployeesPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    employee_name: '',

    role: '',

    shift: '',

    payroll: '',

    companies: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { employees } = useAppSelector((state) => state.employees);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: id }));
  }, [id]);

  useEffect(() => {
    if (typeof employees === 'object') {
      setInitialValues(employees);
    }
  }, [employees]);

  useEffect(() => {
    if (typeof employees === 'object') {
      const newInitialVal = { ...initVals };
      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = employees[el]),
      );
      setInitialValues(newInitialVal);
    }
  }, [employees]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }));
    await router.push('/employees/employees-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit employees')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit employees'}
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
              <FormField label='EmployeeName'>
                <Field name='employee_name' placeholder='EmployeeName' />
              </FormField>

              <FormField label='Role'>
                <Field name='role' placeholder='Role' />
              </FormField>

              <FormField label='Shift'>
                <Field name='shift' placeholder='Shift' />
              </FormField>

              <FormField label='Payroll'>
                <Field type='number' name='payroll' placeholder='Payroll' />
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
                  onClick={() => router.push('/employees/employees-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditEmployeesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_EMPLOYEES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditEmployeesPage;
