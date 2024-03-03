import { Box, Button, Link } from "@primer/react";
import { Backup } from "../../../../data-models/db-models";
import { TDatabaseContextProps } from "../../database-context";
import css from "./backup-tab.module.css";
import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { APIService } from "../../../../auth/api-service";
import { ErrorMessage } from "../../../../shared/messages/error-message";

type TBackupTableProps = TDatabaseContextProps & {
    onItem: (item: Backup) => void;
}

export const BackupTable = (props: TBackupTableProps) => {

    const { backup_info, onItem, onRefetch } = props;
    const [btn_disabled, setBtnDisabled] = useState(false);
    const [error_msg, setError] = useState<string>();
    const { instance, accounts } = useMsal();

    const HandleOnBackup = async () => {
        if (backup_info) {
            setError(undefined);
            setBtnDisabled(true);
    
            if (await backup_info.RunBackupAsync(new APIService(instance, accounts))) {
                setTimeout(() => {
                    onRefetch();
                    setBtnDisabled(false);
                }, 3000);
            }
            else {
                setError("Failed to run manual backup for this db");
            }
        }
    };

    return (
        <div>
            <Box
                display="flex"
                justifyContent="flex-end"
                mb={3}>
                <Button 
                    disabled={btn_disabled}
                    onClick={HandleOnBackup}
                    variant="primary">
                    New backup (run now)
                </Button>
            </Box>

            <ErrorMessage 
                style={{ marginBottom: "20px" }}
                message={error_msg} />

            <table className={css.table}>
                <thead>
                    <tr>
                        <Box
                            as="th"
                            backgroundColor="var(--bg-color)"
                            padding="8px 16px"
                            textAlign="start"
                            borderStyle="solid"
                            borderColor="border.default"
                            borderWidth={1}>
                            Date created
                        </Box>
                        <Box
                            as="th"
                            backgroundColor="var(--bg-color)"
                            padding="8px 16px"
                            textAlign="start"
                            borderStyle="solid"
                            borderColor="border.default"
                            borderWidth={1}>
                            Status
                        </Box>
                    </tr>
                </thead>
                <tbody>
                    {backup_info!.ToSortedBackups().map(bak => {
                        return (
                            <tr key={bak.oid}>
                                <Box
                                    as="td"
                                    padding="8px 16px"
                                    textAlign="start"
                                    borderStyle="solid"
                                    borderColor="border.default"
                                    borderWidth={1}>
                                    <Link
                                        onClick={() => onItem(bak)}
                                        sx={{ cursor: "pointer" }}>
                                        {bak.ToDateStr()}
                                    </Link>
                                </Box>
                                <Box
                                    as="td"
                                    padding="8px 16px"
                                    textAlign="start"
                                    borderStyle="solid"
                                    borderColor="border.default"
                                    borderWidth={1}>
                                    {bak.job.done ? "Done" : "Running"}
                                </Box>
                            </tr>
                        )
                    })
                    }
                </tbody>
            </table>
        </div>
    );
}