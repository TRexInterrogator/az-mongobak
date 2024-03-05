import { PublicClientApplication } from "@azure/msal-browser";
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate } from "@azure/msal-react";
import { UnauthPage } from "./pages/unauthenticated/unauth-page";
import { Layout } from "./shared/layout/layout";
import { Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/landing-page/landing-page";
import { ConnectionProfilesPage } from "./pages/connection-profiles/connection-profiles";
import { NewConnectionProfilePage } from "./pages/new-connection-profile/new-connection-profile";
import { AdminAuth } from "./auth/admin-auth/admin-auth";
import { EditConnectionProfilePage } from "./pages/edit-connection-profile/edit-connection-profile-page";
import { NewDataBasePage } from "./pages/new-database/new-database-page";
import { MiniBackupInfoProvider } from "./shared/mini-backup-context/mini-backup-context-provider";
import { DatabasePage } from "./pages/database-page/database-page";


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
                    <MiniBackupInfoProvider>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/connection/manage" element={<ConnectionProfilesPage />} />
                                <Route path="/connection/new" element={<NewConnectionProfilePage />} />
                                <Route path="/connection/edit" element={<EditConnectionProfilePage />} />
                                <Route path="/database/new" element={<NewDataBasePage />} />
                                <Route path="/database/manage" element={<DatabasePage />} />
                            </Routes>
                        </Layout>
                    </MiniBackupInfoProvider>
                </AdminAuth>
            </AuthenticatedTemplate>
        </MsalProvider>
    );
}