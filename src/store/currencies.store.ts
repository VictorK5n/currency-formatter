import { action, makeObservable, observable } from 'mobx';

import { CurrencyType } from '../shared/api';
import { RootStoreType } from './root.store';

export class CurrenciesStore {
  rootStore;
  currenciesList: CurrencyType[] = [];

  constructor(rootStore: RootStoreType) {
    this.rootStore = rootStore;

    makeObservable(this, {
      currenciesList: observable,
      setCurrenciesList: action,
    });
  }

  setCurrenciesList(currenciesList: CurrencyType[]) {
    this.currenciesList = currenciesList;
  }
}
