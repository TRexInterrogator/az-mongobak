import { LogLevel } from "@azure/msal-browser";


export const MsalConfig = {
    auth: {
        clientId: import.meta.env.VITE_CLIENT_ID,
        authority: import.meta.env.VITE_AUTHORITY,
        redirectUri: import.meta.env.VITE_REDIRECT_URL,
        postLogoutRedirectUri: "/",
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: "localStorage"
    },
    system: {
        windowHashTimeout: 20000,
        iframeHashTimeout: 20000,
        loggerOptions: {
            loggerCallback: (level: number, message: string, containsPii: boolean) => {
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