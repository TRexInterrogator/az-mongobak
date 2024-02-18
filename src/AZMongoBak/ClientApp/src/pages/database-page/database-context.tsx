import { DatabaseIcon } from "@primer/octicons-react";
import { PageTitle } from "../../shared/page-title/page-title";
import { TDatabasePageData } from "./database-page";
import { Box, TabNav } from "@primer/react";
import { useState } from "react";
import { InfoTab } from "./tabs/info-tab/info-tab";
import { BackupTab } from "./tabs/backup-tab/backup-tab";
import { SettingsTab } from "./tabs/settings-tab/settings-tab";

export type TDatabaseContextProps = TDatabasePageData & {
    onRefetch: () => void;
}

export const DatabaseContext = (props: TDatabaseContextProps) => {

    const { backup_info, connection } = props;
    const [index, setIndex] = useState(0);

    return (
        <>
            {backup_info && connection &&
                <div>
                    <PageTitle
                        description="Backup profile"
                        icon={<DatabaseIcon size={24} />}>
                        {backup_info.display_name}
                    </PageTitle>

                    <TabNav sx={{ mt: "20px" }}>
                        <TabNav.Link
                            sx={{ cursor: "pointer" }}
                            selected={index === 0}
                            onClick={() => setIndex(0)}>
                            Info
                        </TabNav.Link>
                        <TabNav.Link
                            sx={{ cursor: "pointer" }}
                            selected={index === 1}
                            onClick={() => setIndex(1)}>
                            Backup history
                        </TabNav.Link>
                        <TabNav.Link
                            sx={{ cursor: "pointer" }}
                            selected={index === 2}
                            onClick={() => setIndex(2)}>
                            Settings
                        </TabNav.Link>
                    </TabNav>

                    <Box sx={{mt: "20px"}}>
                        {index === 0 &&
                            <InfoTab {...props} />
                        }

                        {index === 1 &&
                            <BackupTab />
                        }

                        {index === 2 &&
                            <SettingsTab {...props} />
                        }
                    </Box>
                </div>
            }
        </>
    );
}