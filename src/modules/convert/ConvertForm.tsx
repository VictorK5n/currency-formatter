import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import SyncIcon from '@mui/icons-material/Sync';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import {
  Autocomplete,
  Button,
  colors,
  FormControl,
  IconButton,
  TextField,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { down } from 'styled-breakpoints';
import styled from 'styled-components';

import { useExchangeRate } from 'hooks';
import { CurrencyType } from 'shared/api';
import { useConvertStore, useCurrenciesStore } from 'shared/context';
import { metrics } from 'styles/theme';

export type ConvertFormValues = {
  amount: number;
  fromCurrency?: CurrencyType;
  toCurrency?: CurrencyType;
};

const ConvertForm: React.FC = observer(() => {
  const {
    convertValues: { amount, fromCurrency, toCurrency },
    setConvertValues,
  } = useConvertStore();

  const { currenciesList } = useCurrenciesStore();

  const { triggerExchangeRate, isExchageRateLoading, currentExchangeInfo } =
    useExchangeRate({
      baseCurrency: fromCurrency?.code,
      useAsLazy: true,
    });

  const {
    register,
    control,
    watch,
    formState: { errors, isDirty },
    setValue,
    reset,
    handleSubmit,
  } = useForm<ConvertFormValues>({
    defaultValues: {
      amount,
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
    },
    mode: 'onChange',
  });

  const currentFromCurrency = watch('fromCurrency');

  const onChangeCurrencyClick = React.useCallback(() => {
    setValue('fromCurrency', toCurrency, {
      shouldDirty: true,
    });
    setValue('toCurrency', fromCurrency, {
      shouldDirty: true,
    });
    setConvertValues({
      toCurrency: fromCurrency,
      fromCurrency: toCurrency,
    });
  }, [setValue, setConvertValues, toCurrency, fromCurrency]);

  const onSubmit = React.useCallback(() => {
    triggerExchangeRate();
    reset(
      {},
      {
        keepValues: true,
      },
    );
  }, [triggerExchangeRate, reset]);

  React.useEffect(() => {
    if (isDirty) {
      onSubmit();
    }
  }, [isDirty, onSubmit]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FieldsWrapper>
        <FieldWrapper>
          <TextField
            label="Amount"
            error={!!errors.amount?.message}
            helperText={errors.amount?.message}
            InputProps={{
              startAdornment: <span>{currentFromCurrency?.symbol}</span>,
            }}
            fullWidth
            type="number"
            {...register('amount', {
              validate: {
                positive: (amount: number) => {
                  if (amount > 0) {
                    setConvertValues({ amount });
                    return true;
                  }

                  return 'Should be greated than 0';
                },
              },
              valueAsNumber: true,
            })}
          />
        </FieldWrapper>

        <FieldWrapper>
          <FormControl fullWidth>
            <Controller
              control={control}
              name="fromCurrency"
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  onChange={(event, fromCurrency) => {
                    onChange(fromCurrency);
                    setConvertValues({ fromCurrency });
                  }}
                  fullWidth
                  value={value}
                  options={currenciesList}
                  disableClearable
                  isOptionEqualToValue={(option, value) =>
                    option.code === value.code
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="From" />
                  )}
                />
              )}
            />
          </FormControl>
        </FieldWrapper>

        <ChangeCurrencyButton onClick={onChangeCurrencyClick}>
          <SyncAltIcon color="primary" />
        </ChangeCurrencyButton>

        <FieldWrapper>
          <FormControl fullWidth>
            <Controller
              control={control}
              name="toCurrency"
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  fullWidth
                  onChange={(event, toCurrency) => {
                    onChange(toCurrency);
                    setConvertValues({ toCurrency });
                  }}
                  value={value}
                  options={currenciesList}
                  isOptionEqualToValue={(option, value) =>
                    option.code === value.code
                  }
                  disableClearable
                  renderInput={(params) => <TextField {...params} label="To" />}
                />
              )}
            />
          </FormControl>
        </FieldWrapper>
      </FieldsWrapper>

      <SubmitButton
        disabled={isExchageRateLoading}
        type="submit"
        variant="contained"
        startIcon={currentExchangeInfo ? <SyncIcon /> : null}
      >
        {currentExchangeInfo ? 'Update' : 'Convert'}
      </SubmitButton>
    </Form>
  );
});

const FieldsWrapper = styled.div`
  display: flex;
  align-items: center;

  ${down('sm')} {
    flex-direction: column;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const ChangeCurrencyButton = styled(IconButton)`
  border-radius: 50%;
  border: 1px solid ${colors.blue[700]};
  margin-right: ${metrics.margin.doubleBase}px;

  ${down('sm')} {
    margin-right: 0;
    margin-bottom: ${metrics.margin.doubleBase}px;
  }
`;

const FieldWrapper = styled.div`
  width: 100%;

  &:not(:last-of-type) {
    margin-right: ${metrics.margin.doubleBase}px;
  }

  & .MuiFormHelperText-root {
    position: absolute;
    top: 100%;
  }

  ${down('sm')} {
    margin-right: 0;
    margin-bottom: ${metrics.margin.doubleBase}px;
  }
`;

const SubmitButton = styled(Button)`
  width: fit-content;
  margin-top: ${metrics.margin.doubleBase}px;
  margin-bottom: ${metrics.margin.base}px;
  justify-content: flex-end;
  align-self: flex-end;

  ${down('sm')} {
    width: 100%;
    justify-content: center;
  }
`;

export default ConvertForm;
