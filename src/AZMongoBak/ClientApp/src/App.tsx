import { PublicClientApplication } from "@azure/msal-browser";
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate } from "@azure/msal-react";
import { UnauthPage } from "./pages/unauthenticated/unauth-page";
import { Layout } from "./shared/layout/layout";
import { Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/landing-page/landing-page";
import { ConnectionProfilesPage } from "./pages/connection-profiles/connection-profiles";
import { NewConnectionProfilePage } from "./pages/new-connection-profile/new-connection-profile";
import { AdminAuth } from "./auth/admin-auth/admin-auth";


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
                <AdminAuth>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/connection/manage" element={<ConnectionProfilesPage />} />
                            <Route path={"/connection/new"} element={<NewConnectionProfilePage />} />
                        </Routes>
                    </Layout>
                </AdminAuth>
            </AuthenticatedTemplate>
        </MsalProvider>
    );
}