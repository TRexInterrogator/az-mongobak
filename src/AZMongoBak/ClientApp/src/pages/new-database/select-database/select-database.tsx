import { DatabaseIcon } from "@primer/octicons-react";
import { ActionList, ActionMenu, Text } from "@primer/react";
import { useState } from "react";

interface IDatabaseSelectProps {
    dbs: string[];
    disabled?: boolean;
    onChange: (db: string) => void;
}

export const DatabaseSelect = (props: IDatabaseSelectProps) => {

    const { dbs, disabled, onChange } = props;
    const [ selected_db, setSelectedDb ] = useState<string>();

    const HandleOnDbChanged = (new_db: string) => {
        if (!disabled) {
            setSelectedDb(new_db);
            onChange(new_db);
        }
    };

    return (
        <div>
            <Text as="p">
                Database:
            </Text>
            <ActionMenu>
                { selected_db ?
                    <ActionMenu.Button leadingIcon={DatabaseIcon}>
                        {selected_db}
                    </ActionMenu.Button>
                    :
                    <ActionMenu.Button>Select database</ActionMenu.Button>
                }
                
                <ActionMenu.Overlay>
                    { dbs &&
                        <ActionList>
                            { dbs.map(name => {
                                return (
                                    <ActionList.Item 
                                        onSelect={() => HandleOnDbChanged(name)}
                                        key={name}>
                                        {name}
                                        <ActionList.LeadingVisual>
                                            <DatabaseIcon />
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