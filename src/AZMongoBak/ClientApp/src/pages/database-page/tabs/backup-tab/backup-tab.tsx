import { useState } from "react";
import { TDatabaseContextProps } from "../../database-context";
import { BackupTable } from "./backup-table";
import { Backup } from "../../../../data-models/db-models";
import { BackupDetails } from "./backup-details";

export const BackupTab = (props: TDatabaseContextProps) => {
    
    const { onRefetch } = props;
    const [ backup, setBackup ] = useState<Backup>();

    const HandleOnDelete = () => {
        setBackup(undefined);
        onRefetch();
    };

    return (
        <div>
            { backup ?
                <BackupDetails 
                    onDelete={HandleOnDelete}
                    onClose={() => setBackup(undefined)}
                    backup={backup} />
                :
                <BackupTable 
                    {...props} 
                    onItem={setBackup} />
            }
        </div>
    );
}