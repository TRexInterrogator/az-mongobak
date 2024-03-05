import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app.tsx'
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalConfig } from './auth/msal-config.ts';
import { ThemeProvider } from "@primer/react";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const msal_instance = new PublicClientApplication(MsalConfig);
const query_client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider colorMode="light">
      <BrowserRouter>
        <QueryClientProvider client={query_client}>
          <App msal={msal_instance} />
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)