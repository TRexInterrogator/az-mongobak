import { LinkIcon } from "@primer/octicons-react";
import { Box, Text } from "@primer/react";
import css from "./list.module.css";
import { useEffect, useState } from "react";
import { DBConnectionProfile } from "../../../data-models/db-connection-profile";
import { useMsal } from "@azure/msal-react";
import { APIService } from "../../../auth/api-service";
import { ConnectionProfileListItem } from "./connection-profile-list-item";

export const ConnectionProfileList = () => {

    const { instance, accounts } = useMsal();
    const [ api ] = useState(new APIService(instance, accounts));
    const [ profiles, setProfiles ] = useState<DBConnectionProfile[]>([]);

    useEffect(() => {
        (async () => {
            const profile_data = await DBConnectionProfile.ListAllAsync(api);
            setProfiles(profile_data);
        })();
    }, []);


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
                    <Text as="p">
                        <b>{profiles.length}</b>
                    </Text>
                </div>
            </Box>

            { profiles.map(p => {
                return (
                    <ConnectionProfileListItem 
                        key={p.oid} 
                        profile={p} />
                );
            })
            }
        </Box>
    );
}