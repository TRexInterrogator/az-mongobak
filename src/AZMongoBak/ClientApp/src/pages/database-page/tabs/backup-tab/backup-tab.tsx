import { Box, Link } from "@primer/react";
import { TDatabaseContextProps } from "../../database-context";
import css from "./backup-tab.module.css";

// Displays all backups within retention time
export const BackupTab = (props: TDatabaseContextProps) => {
  
  const { backup_info } = props;

  return (
    <div>
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
          { backup_info!.backups.map(bak => {
            return (
              <tr key={bak.oid}>
                <Box 
                  as="td"
                  padding="8px 16px"
                  textAlign="start"
                  borderStyle="solid" 
                  borderColor="border.default"
                  borderWidth={1}>
                  <Link sx={{ cursor: "pointer" }}>
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
};