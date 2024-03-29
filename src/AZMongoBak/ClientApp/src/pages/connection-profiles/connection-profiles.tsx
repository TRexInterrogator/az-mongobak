import { PlusIcon } from "@primer/octicons-react";
import { Button } from "@primer/react";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../shared/page-title/page-title";
import { ConnectionProfileList } from "./list/connection-profile-list";

export const ConnectionProfilesPage = () => {

    const nav = useNavigate();

    return (
        <div>
            <PageTitle>
                Manage connection profiles
            </PageTitle>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button 
                    variant="primary"
                    onClick={() => nav("/connection/new")}
                    leadingIcon={() => <PlusIcon />}>
                        New profile
                </Button>
            </div>

            <div style={{ marginTop: "10px" }}>
                <ConnectionProfileList />
            </div>
        </div>
    );
}