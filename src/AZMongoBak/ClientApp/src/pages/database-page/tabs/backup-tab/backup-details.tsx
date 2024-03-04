import { Box, Button, Text } from "@primer/react";
import { Backup, BackupInfo } from "../../../../data-models/db-models";
import { TrashIcon, XIcon } from "@primer/octicons-react";
import { useState } from "react";
import { InfoMessage } from "../../../../shared/messages/info-message";
import { ErrorMessage } from "../../../../shared/messages/error-message";
import { APIService } from "../../../../auth/api-service";
import { useMsal } from "@azure/msal-react";

type TBackupDetailsProps = {
    backup_info?: BackupInfo;
    backup: Backup;
    onClose: () => void;
    onDelete: () => void;
}

export const BackupDetails = (props: TBackupDetailsProps) => {

    const { backup, backup_info, onClose, onDelete } = props;
    const { instance, accounts } = useMsal();
    
    const [btn_disabled, setBtnDisabled] = useState(false);
    const [info_msg, setInfo] = useState<string>();
    const [error_msg, setError] = useState<string>();

    const HandleOnDelete = async () => {
        if (backup_info) {
            setBtnDisabled(true);
            setError(undefined);
            setInfo("Deleting backup, please wait ..");

            if (await backup.DeleteAsync(backup_info.oid, new APIService(instance, accounts))) {
                onDelete();
            }
            else {
                setBtnDisabled(false);
                setInfo(undefined);
                setError("Failed to delete this backup");
            }
        }
    };

    return (
        <>
            {backup &&
                <div>
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            leadingIcon={() => <XIcon />}
                            onClick={onClose}>
                            Close
                        </Button>
                    </Box>

                    <Text mt={2} as="h2">
                        Backup - {backup.ToDateStr()}
                    </Text>

                    <Text mt={2} as="p">
                        Stored: {backup.stored ? "Yes" : "No"}
                    </Text>

                    <Text as="p">
                        Blob: {backup.blob_path}
                    </Text>

                    <Box mt={3}>
                        <Text as="p">
                            <b>Job running:</b> {backup.job.done ? "False" : "True"}
                        </Text>
                        <Text as="p">
                            <b>Started:</b> {backup.job.ToStartDateStr()}
                        </Text>
                        <Text as="p">
                            <b>Completed:</b> {backup.job.ToEndDateStr()}
                        </Text>

                        { backup.job.done &&
                            <>
                                <Text mt={3} as="p">
                                    Output:
                                </Text>
                                <Box
                                    maxHeight={600}
                                    overflow="auto"
                                    backgroundColor="var(--bg-color)"
                                    borderStyle="solid"
                                    borderColor="border.default"
                                    borderWidth={1}
                                    borderRadius={6}
                                    mt={1}
                                    p={3}>
                                    <Text
                                        as="p"
                                        sx={{ fontFamily: "monospace", whiteSpace: "pre-line" }}>
                                        {backup.job.output}
                                    </Text>
                                </Box>
                            </>
                        }
                    </Box>

                    { backup.job.done &&
                        <>
                            <Button
                                disabled={btn_disabled}
                                onClick={HandleOnDelete}
                                sx={{mt: 4}}
                                leadingIcon={() => <TrashIcon />}
                                variant="danger">
                                Delete backup
                            </Button>

                            <InfoMessage 
                                style={{ marginTop: "20px" }}
                                message={info_msg} />

                            <ErrorMessage 
                                style={{ marginTop: "20px" }}
                                message={error_msg} />
                        </>
                    }
                </div>
            }
        </>
    );
};