import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app.tsx'
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalConfig } from './auth/msal-config.ts';
import { ThemeProvider } from "@primer/react";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

const msal_instance = new PublicClientApplication(MsalConfig);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider colorMode="light">
      <BrowserRouter>
        <App msal={msal_instance} />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)