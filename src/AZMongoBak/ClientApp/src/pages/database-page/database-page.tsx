import { useMsal } from "@azure/msal-react";
import { Spinner } from "@primer/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { APIService } from "../../auth/api-service";
import { DBConnectionProfile } from "../../data-models/db-connection-profile";
import { BackupInfo } from "../../data-models/db-models";
import { DatabaseContext } from "./database-context";


export type TDatabasePageData = {
    backup_info?: BackupInfo;
    connection?: DBConnectionProfile;
}

export const DatabasePage = () => {

    const loc = useLocation();
    const { instance, accounts } = useMsal();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["database-page"],
        refetchOnMount: false,
        queryFn: async () => {
            const page_data: TDatabasePageData = {};
            const db_oid = new URLSearchParams(loc.search).get("oid");

            if (db_oid) {
                const api = new APIService(instance, accounts);
                const backup_info = await BackupInfo.GetByOidAsync(db_oid, api);
                
                if (backup_info && backup_info.connection_profile) {
                    const db_connection = await DBConnectionProfile.GetAsync(backup_info.connection_profile, api);

                    if (db_connection) {
                        page_data.backup_info = backup_info;
                        page_data.connection = db_connection;
                    }
                }
            }

            return page_data;
        }
    });

    useEffect(() => {
        // Re-fetches data on location change (strict mode, will fetch twice in dev)
        // refetch used in context after prop update
        refetch();
    }, [ loc.search, refetch ]);

    return (
        <>
        { isLoading &&
            <div style={{ 
                padding: "40px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
            }}>
                <Spinner />
            </div>
        }

        { data &&
            <DatabaseContext onRefetch={refetch} {...data} />
        }
        </>
    );
}