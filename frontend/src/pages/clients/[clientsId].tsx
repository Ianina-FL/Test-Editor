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

import { update, fetch } from '../../stores/clients/clientsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditClients = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    companies: null,

    client_name: '',

    date_registered: new Date(),

    clients_manager: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { clients } = useAppSelector((state) => state.clients);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { clientsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: clientsId }));
  }, [clientsId]);

  useEffect(() => {
    if (typeof clients === 'object') {
      setInitialValues(clients);
    }
  }, [clients]);

  useEffect(() => {
    if (typeof clients === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach((el) => (newInitialVal[el] = clients[el]));

      setInitialValues(newInitialVal);
    }
  }, [clients]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: clientsId, data }));
    await router.push('/clients/clients-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit clients')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit clients'}
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

              <FormField label='Client name'>
                <Field name='client_name' placeholder='Client name' />
              </FormField>

              <FormField label='Date registered'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.date_registered
                      ? new Date(
                          dayjs(initialValues.date_registered).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({
                      ...initialValues,
                      date_registered: date,
                    })
                  }
                />
              </FormField>

              <FormField label='Clients_manager' labelFor='clients_manager'>
                <Field
                  name='clients_manager'
                  id='clients_manager'
                  component={SelectField}
                  options={initialValues.clients_manager}
                  itemRef={'staff'}
                  showField={'employee_name'}
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
                  onClick={() => router.push('/clients/clients-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditClients.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_CLIENTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditClients;
