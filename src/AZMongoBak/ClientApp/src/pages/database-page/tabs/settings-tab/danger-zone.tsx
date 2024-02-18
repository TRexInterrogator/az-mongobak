import { Box, Button, Checkbox, FormControl, Spinner, Text } from "@primer/react";
import { TDatabaseContextProps } from "../../database-context";
import { useContext, useState } from "react";
import { TrashIcon } from "@primer/octicons-react";
import { ErrorMessage } from "../../../../shared/messages/error-message";
import { useMsal } from "@azure/msal-react";
import { MiniBackupInfoContext } from "../../../../shared/mini-backup-context/mini-backup-context";
import { APIService } from "../../../../auth/api-service";
import { MiniBackupInfo } from "../../../../data-models/mini-backup-info";
import { useNavigate } from "react-router-dom";

export const DangerZone = (props: TDatabaseContextProps) => {

    const { backup_info } = props;
    const { instance, accounts } = useMsal();
    const context = useContext(MiniBackupInfoContext);
    const nav = useNavigate();
    
    const [confirm, setConfirm] = useState(false);
    const [is_deleting, setDeleting] = useState(false);
    const [error_msg, setError] = useState<string>();

    const HandleOnDelete = async () => {
        if (backup_info) {
            setDeleting(true);
            setError(undefined);

            const api = new APIService(instance, accounts);
            const deleted = await backup_info.DeleteAsync(api);
            
            if (deleted) {
                // Update sidebar
                const mini_infos = await MiniBackupInfo.ListAsync(api);
                context.update(mini_infos);

                // Navigate to landing page
                nav("/");
            }
            else {
                setDeleting(false);
                setError("Failed to delete this backup profile");
            }
        }
    };

    return (
        <Box sx={{ mt: "40px" }}>
            <Box
                backgroundColor="#fff"
                borderColor="border.default"
                borderStyle="solid"
                borderRadius={6}
                borderWidth={1}>
                <Box
                    sx={{
                        borderTopLeftRadius: "6px",
                        borderTopRightRadius: "6px",
                        backgroundColor: "var(--bg-color)",
                        p: "16px",
                        borderWidth: 1
                    }}>
                    <Text sx={{ fontWeight: 600 }} as="p">
                        Danger Zone
                    </Text>
                </Box>

                <div style={{ padding: "16px" }}>
                    <FormControl>
                        <Checkbox
                            disabled={is_deleting}
                            onChange={e => setConfirm(e.target.checked)} />
                        <FormControl.Label>
                            I want to delete this backup profile and all stored backups
                        </FormControl.Label>
                    </FormControl>

                    {is_deleting ?
                        <Button
                            disabled={true}
                            sx={{ mt: "20px" }}
                            variant="danger">
                            <div style={{ display: "flex", alignItems: "center", columnGap: "10px" }}>
                                <Spinner size="small" />
                                Deleting ..
                            </div>
                        </Button>
                        :
                        <Button
                            onClick={HandleOnDelete}
                            disabled={!confirm}
                            sx={{ mt: "20px" }}
                            leadingIcon={() => <TrashIcon />}
                            variant="danger">
                            Delete
                        </Button>
                    }

                    <ErrorMessage 
                        style={{ marginTop: "20px" }}
                        message={error_msg} />

                </div>
            </Box>
        </Box>
    );
}