import { useMsal } from "@azure/msal-react";
import { LinkIcon } from "@primer/octicons-react";
import { Box, Text } from "@primer/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { APIService } from "../../../auth/api-service";
import { DBConnectionProfile } from "../../../data-models/db-connection-profile";
import { ConnectionProfileListItem } from "./connection-profile-list-item";
import css from "./list.module.css";

export const ConnectionProfileList = () => {

    const { instance, accounts } = useMsal();
    const [ api ] = useState(new APIService(instance, accounts));

    const { data } = useQuery({
        queryKey: ["conprof_list"],
        queryFn: async () => {
            const profile_data = await DBConnectionProfile.ListAllAsync(api);

            return {
                profiles: profile_data
            }
        }
    });

    return (
        <Box   
            backgroundColor="#fff"
            borderColor="border.default"
            borderStyle="solid" 
            borderRadius={6}
            borderWidth={1}>
            <Box 
                className={css.listHead}
                borderWidth={1}>
                <div id="lr">
                    <Text 
                        fontWeight={600} 
                        as="p" 
                        className={css.listHeadTitle}>
                        <LinkIcon />
                        Connection profiles:
                    </Text>
                    { data &&
                        <Text as="p">
                            <b>{data.profiles.length}</b>
                        </Text>
                    }
                </div>
            </Box>
            
            { data &&
                <>
                { data.profiles.map(p => {
                    return (
                        <ConnectionProfileListItem 
                            key={p.oid} 
                            profile={p} />
                    );
                })
                }
                </>
            }
        </Box>
    );
}