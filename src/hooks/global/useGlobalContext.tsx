import { useContext } from 'react';

import { GlobalContext } from 'shared/context';

export const useGlobalContext = () => useContext(GlobalContext);
