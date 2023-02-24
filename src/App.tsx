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
import { RootStoreContextProvider } from 'shared/context/store/rootStoreContext';
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
          <RootStoreContextProvider>
            <RouterProvider router={router} />
          </RootStoreContextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
