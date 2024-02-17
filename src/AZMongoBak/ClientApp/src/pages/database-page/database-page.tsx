import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { BackupInfo } from "../../data-models/db-models";
import { useMsal } from "@azure/msal-react";
import { APIService } from "../../auth/api-service";
import { DBConnectionProfile } from "../../data-models/db-connection-profile";
import { DatabaseContext } from "./database-context";
import { Spinner } from "@primer/react";
import { useEffect } from "react";


export type TDatabasePageData = {
    backup_info?: BackupInfo;
    connection?: DBConnectionProfile;
}

export const DatabasePage = () => {

    const loc = useLocation();
    const { instance, accounts } = useMsal();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["database-page"],
        queryFn: async () => {
            console.log("refetch");
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
        // Figure our to prevent re-renders on inital load ..
        refetch();
    }, [ loc.search ]);

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