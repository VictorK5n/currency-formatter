import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  Autocomplete,
  CircularProgress,
  FormControl,
  TextField,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import { useExchangeRate } from 'hooks';
import { CurrencyType } from 'shared/api';
import { useCurrenciesStore, useExchangeListStore } from 'shared/context';
import { metrics } from 'styles/theme';

export type CurrencyListFormValues = {
  activeBaseCurrency: CurrencyType;
  activeCurrencies: CurrencyType[];
};

const CurrencyListForm: React.FC = observer(() => {
  const {
    baseCurrency,
    activeCurrenciesList,
    setBaseCurrency,
    setActiveCurrenciesList,
  } = useExchangeListStore();
  const { currenciesList } = useCurrenciesStore();

  const {
    control,
    watch,
    formState: { isDirty },
    reset,
    getValues,
    handleSubmit,
  } = useForm<CurrencyListFormValues>({
    defaultValues: {
      activeBaseCurrency: baseCurrency!,
      activeCurrencies: activeCurrenciesList,
    },
    mode: 'onChange',
  });

  const { activeBaseCurrency, activeCurrencies } = watch();

  const { triggerExchangeRate, isExchageRateLoading, exchangeRate } =
    useExchangeRate({
      baseCurrency: activeBaseCurrency?.code,
      enabled: activeCurrencies.length > 0,
    });

  const shouldUpdate =
    activeCurrencies.length &&
    !exchangeRate?.[activeBaseCurrency.code] &&
    isDirty;

  const onSubmit = React.useCallback(() => {
    triggerExchangeRate();
    reset(
      {},
      {
        keepValues: true,
      },
    );
  }, [reset, triggerExchangeRate]);

  React.useEffect(() => {
    if (shouldUpdate) {
      onSubmit();
    }
  }, [shouldUpdate, onSubmit, getValues]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FieldsWrapper>
        <FieldWrapper>
          <FormControl fullWidth>
            <Controller
              control={control}
              name="activeBaseCurrency"
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  fullWidth
                  onChange={(event, options) => {
                    onChange(options);
                    setBaseCurrency(options);
                  }}
                  value={value}
                  options={currenciesList}
                  disableClearable
                  isOptionEqualToValue={(option, value) =>
                    option.code === value.code
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Base currency" />
                  )}
                />
              )}
            />
          </FormControl>
        </FieldWrapper>

        <FieldWrapper>
          <FormControl fullWidth>
            <Controller
              control={control}
              name="activeCurrencies"
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  fullWidth
                  onChange={(event, options) => {
                    onChange(options);
                    setActiveCurrenciesList(options);
                  }}
                  value={value}
                  options={currenciesList}
                  isOptionEqualToValue={(option, value) =>
                    option.code === value.code
                  }
                  multiple
                  disableClearable
                  renderInput={(params) => (
                    <TextField {...params} label="Currencies list" />
                  )}
                />
              )}
            />
          </FormControl>
          {isExchageRateLoading ? (
            <LoaderWrapper>
              <CircularProgress size={20} />
            </LoaderWrapper>
          ) : null}
        </FieldWrapper>
      </FieldsWrapper>
    </Form>
  );
});

const Form = styled.form`
  display: flex;
  align-self: flex-start;
`;

const FieldsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const FieldWrapper = styled.div`
  margin-bottom: ${metrics.margin.doubleBase}px;
  width: 100%;
  position: relative;

  & .MuiFormHelperText-root {
    position: absolute;
    top: 100%;
  }

  & .MuiAutocomplete-root .MuiOutlinedInput-root {
    padding-right: ${metrics.padding.mdContent}px;
  }
`;

const LoaderWrapper = styled.div`
  display: block;
  position: absolute;
  right: ${metrics.margin.tripleBase}px;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export default CurrencyListForm;
