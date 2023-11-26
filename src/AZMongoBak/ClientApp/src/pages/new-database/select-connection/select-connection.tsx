import { useEffect, useState } from "react";
import { APIService } from "../../../auth/api-service";
import { DBConnectionProfile } from "../../../data-models/db-connection-profile";
import { ActionList, ActionMenu } from "@primer/react";
import { LinkIcon } from "@primer/octicons-react";

interface IConnectionProfileSelectProps {
    disabled?: boolean;
    api: APIService;
    onChange: (profile: DBConnectionProfile) => void;
}

export const ConnectionProfileSelect = (props: IConnectionProfileSelectProps) => {

    const { disabled, api, onChange } = props;
    const [ profiles, setProfiles ] = useState<DBConnectionProfile[]>();
    const [ selectedProfile, setProfile ] = useState<DBConnectionProfile>();

    useEffect(() => {
        (async () => {
            setProfiles(await DBConnectionProfile.ListAllAsync(api));
        })();
    }, [ api ]);

    const HandleOnProfileSelected = (profile: DBConnectionProfile) => {
        setProfile(profile);
        onChange(profile);
    };

    return (
        <div style={{ marginTop: "30px" }}>
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
                    { profiles &&
                        <ActionList>
                            { profiles.map(p => {
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