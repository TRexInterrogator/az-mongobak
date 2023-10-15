import { PublicClientApplication } from "@azure/msal-browser";
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate } from "@azure/msal-react";
import { UnauthPage } from "./pages/unauthenticated/unauth-page";


interface IAppProps {
    msal: PublicClientApplication;
}

export const App = (props: IAppProps) => {

    return (
        <MsalProvider instance={props.msal}>
            <UnauthenticatedTemplate>
                <UnauthPage />
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                <h1>Logged in!</h1>
            </AuthenticatedTemplate>
        </MsalProvider>
    );
}