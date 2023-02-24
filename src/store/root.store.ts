import { ConvertStore } from './convert.store';
import { CurrenciesStore } from './currencies.store';
import { ExchangeListStore } from './echangeList.store';

class RootStore {
  currenciesStore: CurrenciesStore;
  exchangeListStore: ExchangeListStore;
  convertStore: ConvertStore;

  constructor() {
    this.currenciesStore = new CurrenciesStore(this);
    this.exchangeListStore = new ExchangeListStore(this);
    this.convertStore = new ConvertStore(this);
  }
}

export const rootStore = new RootStore();
export type RootStoreType = typeof rootStore;
