import { Box, Button, FormControl, Spinner, TextInput } from "@primer/react";
import { TDatabaseContextProps } from "../../database-context";
import { useContext, useEffect, useState } from "react";
import { StrNotEmpty } from "../../../../shared/validation/validation";
import { SyncIcon } from "@primer/octicons-react";
import { useMsal } from "@azure/msal-react";
import { APIService } from "../../../../auth/api-service";
import { ErrorMessage } from "../../../../shared/messages/error-message";
import { MiniBackupInfoContext } from "../../../../shared/mini-backup-context/mini-backup-context";
import { MiniBackupInfo } from "../../../../data-models/mini-backup-info";
import { DangerZone } from "./danger-zone";


export const SettingsTab = (props: TDatabaseContextProps) => {

    const { backup_info, onRefetch } = props;
    const { instance, accounts } = useMsal();
    const context = useContext(MiniBackupInfoContext);

    const [form_disabled, setFormDisabled] = useState(false);
    const [save_disabled, setSaveDisabled] = useState(true);
    const [ error_msg, setError ] = useState<string>();
    const [name, setName] = useState(backup_info!.display_name);
    const [retention, setRetention] = useState(backup_info!.retention_days.toString());

    useEffect(() => {
        setName(backup_info ? backup_info.display_name : "?");
        setRetention(backup_info ? backup_info.retention_days.toString() : "10");
    }, [ backup_info ]);


    const HandleOnNameChanged = (val: string) => {
        setName(val);
        setSaveDisabled(StrNotEmpty(val) && Number.parseInt(retention) > 0 ? false : true);
    };

    const HandleOnRetentionChanged = (val: string) => {
        setRetention(val);
        setSaveDisabled(StrNotEmpty(name) && Number.parseInt(val) > 0 ? false : true);
    }

    const HandleOnSave = async () => {
        if (backup_info) {
            setFormDisabled(true);
            setError(undefined);
            const api = new APIService(instance, accounts);

            backup_info.display_name = name;
            backup_info.retention_days = Number.parseInt(retention);

            const update = await backup_info.SaveAsync(api);

            setSaveDisabled(true);
            setFormDisabled(false);

            if (update) {
                onRefetch();

                // Update sidebar
                const mini_infos = await MiniBackupInfo.ListAsync(api);
                context.update(mini_infos);
            }
            else {
                setError("Failed to save changes");
            }
        }
    };

    return (
        <div>
            <Box>
                <FormControl disabled={form_disabled}>
                    <FormControl.Label required>
                        Friendly name
                    </FormControl.Label>
                    <TextInput
                        value={name}
                        onChange={e => HandleOnNameChanged(e.target.value)}
                        width="100%"
                        type="text" />
                </FormControl>
                
                <br />

                <FormControl disabled={form_disabled}>
                    <FormControl.Label htmlFor="retention" required>
                        Retention time in days
                    </FormControl.Label>
                    <TextInput
                        onChange={e => HandleOnRetentionChanged(e.target.value)}
                        value={retention}
                        width="100%"
                        type="number" />
                </FormControl>

                { form_disabled ?
                    <Button
                        disabled={true}
                        sx={{mt: "20px"}}
                        variant="primary">
                        <div style={{ display: "flex", alignItems: "center", columnGap: "10px" }}>
                            <Spinner size="small" />
                            Saving changes ..
                        </div>
                    </Button>
                    :
                    <Button
                        onClick={HandleOnSave}
                        disabled={save_disabled}
                        leadingIcon={() => <SyncIcon />}
                        sx={{mt: "20px"}}
                        variant="primary">
                        Save changes
                    </Button>
                }

                <ErrorMessage 
                    style={{ marginTop: "20px" }}
                    message={error_msg} />

                <DangerZone {...props} />
            </Box>
        </div>
    );
}