import React from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { StyledEngineProvider } from '@mui/material/styles';
import {} from 'mobx-react-lite';
import { ThemeProvider } from 'styled-components';

import router from 'routes';
import { queryClient } from 'services';
import { GlobalContextProvider } from 'shared/context';
import { CurrenciesContextProvider } from 'shared/context/currenciesContext';
import { GlobalStyle, styledComponentsScheme } from 'styles/theme';

import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <ToastContainer />
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={styledComponentsScheme}>
          <GlobalStyle />
          <GlobalContextProvider>
            <CurrenciesContextProvider>
              <RouterProvider router={router} />
            </CurrenciesContextProvider>
          </GlobalContextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
