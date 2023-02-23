import { CurrenciesStore } from './currencies.store';

class RootStore {
  currenciesStore: CurrenciesStore;

  constructor() {
    this.currenciesStore = new CurrenciesStore(this);
  }
}

export const rootStore = new RootStore();
export type RootStoreType = typeof rootStore;
