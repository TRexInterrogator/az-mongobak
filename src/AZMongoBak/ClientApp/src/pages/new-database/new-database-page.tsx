import { Box } from "@primer/react";
import { PageTitle } from "../../shared/page-title/page-title";
import { DatabaseIcon } from "@primer/octicons-react";
import { ConnectionProfileSelect } from "./select-connection/select-connection";
import { useMsal } from "@azure/msal-react";
import { APIService } from "../../auth/api-service";
import { useState } from "react";
import { DBConnectionProfile } from "../../data-models/db-connection-profile";

export const NewDataBasePage = () => {

    const { instance, accounts } = useMsal();
    const [ api ] = useState(new APIService(instance, accounts));
    const [ form_disabled, setFormDisabled ] = useState(false);
    const [ db_names, setDbNames ] = useState<string[]>();
    const [ selected_db, setSelectedDb ] = useState<string>();

    const HandleOnProfileChanged = async (profile: DBConnectionProfile) => {
        setDbNames(await profile.ListDbsAsync(api));
    };
    

    return (
        <Box mt="20px">
            <PageTitle
                icon={<DatabaseIcon size={24} />}
                description="Add a database to backup schedule">
                New database
            </PageTitle>

            <ConnectionProfileSelect 
                disabled={form_disabled}
                onChange={HandleOnProfileChanged}
                api={api} />

            { db_names &&
                <>
                </>
            }
        </Box>
    );
}