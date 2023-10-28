import { CSSProperties } from "react";
import { Box, Text, Link } from "@primer/react";
import { useNavigate } from "react-router-dom";


const LinkStyle: CSSProperties = {
    cursor: "pointer",
    fontWeight: "600"
}

export const LandingPageDocs = () => {

    const nav = useNavigate();

    return (
        <div>
            <Box
                borderColor="border.default" 
                borderWidth={1} 
                borderStyle="solid" 
                p={5} 
                borderRadius="2"
                mt="20px"
                backgroundColor="white">
                <Box
                    mb="10px"
                    borderWidth={1}
                    borderColor="border.default"
                    borderBottomStyle="solid"
                    pb="10px">
                    <Text
                        as="p"
                        fontWeight={600}
                        fontSize="20px">
                            About this app:
                    </Text>
                </Box>

                <Text fontWeight={450}>
                    This web-app is a new backup service solution for MongoDb.
                    You can create full database dumps for backup purposes, based on an automatic schedule.
                    Furthermore, you can restore a database from an existing backup.
                </Text>

                <Box
                    mb="5px"
                    borderWidth={1}
                    borderColor="border.default"
                    borderBottomStyle="solid"
                    mt="30px"
                    pb="10px">
                    <Text
                        as="p"
                        fontWeight={600}
                        fontSize="20px">
                            Database backups:
                    </Text>
                </Box>

                <Text>
                    You can <Link style={LinkStyle} onClick={()=>nav("/database/new")}>create a new database backup</Link>, by adding your database to a backup schedule.
                    You can run a backup manually or wait for the backup job to take effect.
                    All backups are created using a custom database dump format.
                    You won´t be able to restore these dumps using “mongorestore”.
                    Setting a retention time will keep your daily backups for a certain lifespan before deleting them automatically.
                    All backups will be uploaded and stored on Azure (Blob).
                </Text>

                <Box
                    mb="10px"
                    borderWidth={1}
                    borderColor="border.default"
                    borderBottomStyle="solid"
                    mt="30px"
                    pb="10px">
                    <Text
                        as="p"
                        fontWeight={600}
                        fontSize="20px">
                        Restore database:
                    </Text>
                </Box>

                <Text fontWeight={450}>
                    Any backup can be restored to an existing database or a new one.
                    You can choose what option you would like to use in this scenario.
                    A restore will always restore the entire database contents. Existing documents and collections will be overwritten.
                </Text>

                <Box
                    mb="10px"
                    borderWidth={1}
                    borderColor="border.default"
                    borderBottomStyle="solid"
                    mt="30px"
                    pb="10px">
                    <Text
                        as="p"
                        fontWeight={600}
                        fontSize="20px">
                            Connection profiles:
                    </Text>
                </Box>

                <Text fontWeight={450} >
                    Use <Link style={LinkStyle} onClick={()=>nav("/connection/manage")}>connection profiles</Link> to connect different database servers to this web-app.
                    A connection profile will point to a single MongoDb instance / endpoint.
                </Text>

                <Box
                    mb="10px"
                    borderWidth={1}
                    borderColor="border.default"
                    borderBottomStyle="solid"
                    mt="30px"
                    pb="10px">
                    <Text
                        as="p"
                        fontWeight={600}
                        fontSize="20px"
                        mb="px">
                            Automatic backup jobs:
                    </Text>
                </Box>
                <Text fontWeight={450}>
                    Once a day, the backup job manager will be triggered by a “systemd” script from the host system.
                    This script can be edited in order to change the time and frequency, then new backups will be created.
                </Text>
            </Box>
        </div>
    );
} 