import { Box, Button, Text } from "@primer/react";
import { Backup } from "../../../../data-models/db-models";
import { TrashIcon, XIcon } from "@primer/octicons-react";

type TBackupDetailsProps = {
    backup: Backup;
    onClose: () => void;
    onDelete: () => void;
}

export const BackupDetails = (props: TBackupDetailsProps) => {

    const { backup, onClose, onDelete } = props;

    const HandleOnDelete = async () => {
        // Placeholder TODO
        onDelete();
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

                    <Button
                        onClick={HandleOnDelete}
                        sx={{mt: 4}}
                        leadingIcon={() => <TrashIcon />}
                        variant="danger">
                        Delete backup
                    </Button>
                </div>
            }
        </>
    );
};