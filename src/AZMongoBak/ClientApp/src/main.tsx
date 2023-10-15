import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app.tsx'
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalConfig } from './auth/msal-config.ts';
import { ThemeProvider } from "@primer/react";
import "./index.css";

const msal_instance = new PublicClientApplication(MsalConfig);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider colorMode="dark">
      <App msal={msal_instance} />
    </ThemeProvider>
  </React.StrictMode>,
)