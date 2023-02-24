import React, { createContext, FunctionComponent, useContext } from 'react';

import { useCurrenciesList } from 'hooks';
import { CurrencyType } from 'shared/api';
import { ErrorPage, Loader } from 'shared/ui/components';
import { getCurrencyOptions } from 'shared/utils';
import { ConvertStore } from 'store/convert.store';
import { CurrenciesStore } from 'store/currencies.store';
import { ExchangeListStore } from 'store/echangeList.store';
import { rootStore, RootStoreType } from 'store/root.store';

const currenciesStore = new CurrenciesStore(rootStore);
const exchangeListStore = new ExchangeListStore(rootStore);
const convertStore = new ConvertStore(rootStore);

export const RootStoreContext = createContext<{
  rootStore: RootStoreType;
  currenciesStore: CurrenciesStore;
  exchangeListStore: ExchangeListStore;
  convertStore: ConvertStore;
}>({
  rootStore,
  currenciesStore,
  exchangeListStore,
  convertStore,
});

interface RootStoreContextProviderProps {
  children: React.ReactNode;
}

export const RootStoreContextProvider: FunctionComponent<
  RootStoreContextProviderProps
> = ({ children }) => {
  const { currenciesList, currenciesListError, isCurrenciesListLoading } =
    useCurrenciesList();

  const currenciesOptions = getCurrencyOptions(currenciesList);
  const baseCurrency = currenciesOptions.find((c) => c.code === 'USD');
  const toCurrency = currenciesOptions.find((c) => c.code === 'EUR');

  const renderContent = () => {
    if (isCurrenciesListLoading || !baseCurrency) {
      return <Loader />;
    }

    if (currenciesListError) {
      return <ErrorPage />;
    }

    return children;
  };

  if (currenciesOptions) {
    currenciesStore.currenciesList.length === 0 &&
      currenciesStore.setCurrenciesList(currenciesOptions);

    !exchangeListStore.baseCurrency &&
      exchangeListStore.setBaseCurrency(baseCurrency as CurrencyType);

    !convertStore.convertValues.toCurrency &&
      convertStore.setConvertValues({
        fromCurrency: baseCurrency,
        toCurrency,
      });
  }

  return (
    <RootStoreContext.Provider
      value={{
        currenciesStore,
        exchangeListStore,
        rootStore,
        convertStore,
      }}
    >
      {renderContent()}
    </RootStoreContext.Provider>
  );
};

export const useRootStore = () => useContext(RootStoreContext);

export const useExchangeListStore = () =>
  useContext(RootStoreContext).exchangeListStore;

export const useCurrenciesStore = () =>
  useContext(RootStoreContext).currenciesStore;

export const useConvertStore = () => useContext(RootStoreContext).convertStore;
