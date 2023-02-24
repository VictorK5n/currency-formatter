import { action, makeObservable, observable } from 'mobx';

import { CurrencyType } from '../shared/api';
import { RootStoreType } from './root.store';

export type ConvertValuesType = {
  toCurrency?: CurrencyType;
  fromCurrency?: CurrencyType;
  amount: number;
};

export class ConvertStore {
  rootStore;
  convertValues = {
    toCurrency: undefined,
    fromCurrency: undefined,
    amount: 1,
  } as ConvertValuesType;

  constructor(rootStore: RootStoreType) {
    this.rootStore = rootStore;

    makeObservable(this, {
      convertValues: observable,
      setConvertValues: action.bound,
    });
  }

  setConvertValues(convertValues: Partial<ConvertValuesType>) {
    this.convertValues = {
      ...this.convertValues,
      ...convertValues,
    } as ConvertValuesType;
  }
}
