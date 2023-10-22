import { PublicClientApplication } from "@azure/msal-browser";
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate } from "@azure/msal-react";
import { UnauthPage } from "./pages/unauthenticated/unauth-page";
import { Layout } from "./shared/layout/layout";
import { Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/landing-page/landing-page";


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
                <Layout>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                    </Routes>
                </Layout>
            </AuthenticatedTemplate>
        </MsalProvider>
    );
}