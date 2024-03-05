import { Box, Text } from "@primer/react";
import { MiniBackupInfoContext } from "../../mini-backup-context/mini-backup-context";
import { DatabaseLink } from "./database-link";

export const DatabasePane = () => {

    return (
        <Box
            p={3}
            mt="30px" 
            borderStyle="solid"
            borderWidth={1}
            borderRadius={2}
            borderColor="border.default"
            bg="var(--bg-color)">
            <Text sx={{ fontWeight: "bold" }}>Databases</Text>

            <Box mt="10px">
                <MiniBackupInfoContext.Consumer>
                    { context => (
                        <div style={{
                            display: "grid",
                            rowGap: "5px"
                        }}>
                            { context.infos.map(info => {
                                return (
                                    <DatabaseLink 
                                        key={info.oid}
                                        mini_info={info} />
                                );
                            })
                            }
                        </div>
                    )}
                </MiniBackupInfoContext.Consumer>
            </Box>
        </Box>
    );
}