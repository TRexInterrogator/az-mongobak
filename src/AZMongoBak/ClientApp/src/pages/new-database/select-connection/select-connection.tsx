import { LinkIcon } from "@primer/octicons-react";
import { ActionList, ActionMenu, Text } from "@primer/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { APIService } from "../../../auth/api-service";
import { DBConnectionProfile } from "../../../data-models/db-connection-profile";

interface IConnectionProfileSelectProps {
    disabled?: boolean;
    api: APIService;
    onChange: (profile: DBConnectionProfile) => void;
}

export const ConnectionProfileSelect = (props: IConnectionProfileSelectProps) => {

    const { disabled, api, onChange } = props;
    const [ selectedProfile, setProfile ] = useState<DBConnectionProfile>();

    const { data } = useQuery({
        queryKey: ["conprof_sel"],
        queryFn: async () => {
            const data = await DBConnectionProfile.ListAllAsync(api);

            return {
                profiles: data
            }
        }
    });

    const HandleOnProfileSelected = (profile: DBConnectionProfile) => {
        setProfile(profile);
        onChange(profile);
    };

    return (
        <div>
            <Text as="p">
                Connection profile:
            </Text>
            <ActionMenu>
                { selectedProfile ?
                    <ActionMenu.Button 
                        disabled={disabled}
                        leadingIcon={LinkIcon}>
                            {selectedProfile.displayname}
                    </ActionMenu.Button>
                    :
                    <ActionMenu.Button disabled={disabled}>
                        Select connection profile
                    </ActionMenu.Button>
                }

                <ActionMenu.Overlay>
                    { data &&
                        <ActionList>
                            { data.profiles.map(p => {
                                return (
                                    <ActionList.Item 
                                    onSelect={() => HandleOnProfileSelected(p)}
                                    key={p.oid}>
                                        {p.displayname}
                                        <ActionList.LeadingVisual>
                                            <LinkIcon />
                                        </ActionList.LeadingVisual>
                                    </ActionList.Item>
                                );
                            })
                        }
                        </ActionList>
                    }
                </ActionMenu.Overlay>
            </ActionMenu>
        </div>
    );
}