import { LogLevel, BrowserCacheLocation } from "@azure/msal-browser";


export const MsalConfig = {
    auth: {
        clientId: import.meta.env.VITE_CLIENT_ID,
        authority: import.meta.env.VITE_AUTHORITY,
        redirectUri: window.location.origin,
        postLogoutRedirectUri: "/",
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage
    },
    system: {
        windowHashTimeout: 20000,
        iframeHashTimeout: 20000,
        loggerOptions: {
            loggerCallback: (level: any, message: any, containsPii: any) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            }
        }
    }
};


export const LoginRequest = {
    scopes: ["User.Read"]
};