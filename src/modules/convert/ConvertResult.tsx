import React from 'react';

import { colors, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import { useExchangeRate } from 'hooks';
import { useConvertStore } from 'shared/context';
import { ErrorMessage, Loader } from 'shared/ui/components';
import { getConvertedCurrenciesInfo } from 'shared/utils';
import { metrics } from 'styles/theme';

const ConvertResult: React.FC = observer(() => {
  const {
    convertValues: { fromCurrency, amount, toCurrency },
  } = useConvertStore();

  const {
    isExchageRateLoading,
    exchageRateError,
    currentExchangeInfo,
    lastUpdatedAt,
  } = useExchangeRate({
    baseCurrency: fromCurrency?.code,
    useAsLazy: true,
  });

  const currenciesInfo = React.useMemo(
    () =>
      getConvertedCurrenciesInfo({
        amount,
        fromCurrency,
        toCurrency,
        lastUpdatedAt,
        currentExchangeInfo,
      }),
    [currentExchangeInfo, amount, fromCurrency, toCurrency, lastUpdatedAt],
  );

  const showExchangeResult = currentExchangeInfo && currenciesInfo;
  const showLoader = isExchageRateLoading && !currentExchangeInfo;

  const render = () => {
    if (showLoader) {
      return (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      );
    }

    if (exchageRateError) {
      return (
        <ErrorMessage
          errorMessage={
            exchageRateError?.message ?? 'Something wrong, please, try later!'
          }
        />
      );
    }

    if (showExchangeResult) {
      return (
        <Typography variant="h6" fontWeight={500} color={colors.blue[500]}>
          {currenciesInfo.fromCurrencyText} = {currenciesInfo.toCurrencyText}
          {currenciesInfo.lastUpdate && (
            <Typography variant="body2">
              {`Last update:
          ${currenciesInfo.lastUpdate}`}
            </Typography>
          )}
        </Typography>
      );
    }

    return null;
  };

  return <Wrapper>{render()}</Wrapper>;
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const LoaderWrapper = styled.div`
  margin: ${metrics.margin.base}px;
`;

export default ConvertResult;
