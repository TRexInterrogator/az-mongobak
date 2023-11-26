import { DatabaseIcon } from "@primer/octicons-react";
import { ActionMenu } from "@primer/react";
import { useState } from "react";

interface IDatabaseSelectProps {
    dbs: string[];
    disabled?: boolean;
    onChange: (db: string) => void;
}

// TODO: Finish database select

export const DatabaseSelect = (props: IDatabaseSelectProps) => {

    const { dbs, disabled, onChange } = props;
    const [ selected_db, setSelectedDb ] = useState<string>();

    return (
        <div>
            <ActionMenu>
                { selected_db ?
                    <ActionMenu.Button leadingIcon={DatabaseIcon}>
                        {selected_db}
                    </ActionMenu.Button>
                    :
                    <ActionMenu.Button>Database</ActionMenu.Button>
                }
                
                <ActionMenu.Overlay>
                    { db_names &&
                        <ActionList>
                            { db_names.map(name => {
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