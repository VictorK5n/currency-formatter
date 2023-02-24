import { action, makeObservable, observable } from 'mobx';

import { CurrencyType } from '../shared/api';
import { RootStoreType } from './root.store';

export class ExchangeListStore {
  rootStore;
  baseCurrency: CurrencyType | null = null;
  activeCurrenciesList: CurrencyType[] = [];

  constructor(rootStore: RootStoreType) {
    this.rootStore = rootStore;

    makeObservable(this, {
      activeCurrenciesList: observable,
      baseCurrency: observable,
      setActiveCurrenciesList: action.bound,
      setBaseCurrency: action.bound,
    });
  }

  setActiveCurrenciesList(activeCurrenciesList: CurrencyType[]) {
    this.activeCurrenciesList = activeCurrenciesList;
  }

  setBaseCurrency(baseCurrency: CurrencyType) {
    console.log(baseCurrency);
    this.baseCurrency = baseCurrency;
  }
}
