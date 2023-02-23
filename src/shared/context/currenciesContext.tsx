import React, { createContext, FunctionComponent, useContext } from 'react';

import { useCurrenciesList } from 'hooks';
import { CurrencyType } from 'shared/api';
import { ErrorPage, Loader } from 'shared/ui/components';
import { getCurrencyOptions } from 'shared/utils';

export type CurrenciesContextType = {
  currenciesOptions: CurrencyType[];
  initialBaseCurrency?: CurrencyType;
  initialToCurrency?: CurrencyType;
};

export const CurrenciesContext = createContext<CurrenciesContextType>({
  currenciesOptions: [] as CurrencyType[],
});

interface CurrenciesContextProviderProps {
  children: React.ReactNode;
}

export const CurrenciesContextProvider: FunctionComponent<
  CurrenciesContextProviderProps
> = ({ children }) => {
  const { currenciesList, currenciesListError } = useCurrenciesList();

  console.log('[CurrenciesContextProvider]');

  const currenciesOptions = getCurrencyOptions(currenciesList);
  const initialBaseCurrency = currenciesOptions.find((x) => x.code === 'USD');
  const initialToCurrency = currenciesOptions.find((x) => x.code === 'EUR');

  const isInitialized = initialBaseCurrency && initialToCurrency;

  const renderContent = () => {
    if (!isInitialized) {
      return <Loader />;
    }

    if (currenciesListError) {
      return <ErrorPage />;
    }

    return children;
  };

  return (
    <CurrenciesContext.Provider
      value={{
        currenciesOptions,
        initialBaseCurrency,
        initialToCurrency,
      }}
    >
      {renderContent()}
    </CurrenciesContext.Provider>
  );
};

export const useCurrenciesContext = () => useContext(CurrenciesContext);
