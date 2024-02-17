import { DatabaseIcon } from "@primer/octicons-react";
import { PageTitle } from "../../shared/page-title/page-title";
import { TDatabasePageData } from "./database-page";

type TDatabaseContextProps = TDatabasePageData & {
    onRefetch: () => void;
}

export const DatabaseContext = (props: TDatabaseContextProps) => {
    
    const { backup_info, connection } = props;

    return (
        <>
        { backup_info && connection &&
            <div>
                <PageTitle 
                    description="Backup profile"
                    icon={<DatabaseIcon size={24} />}>
                    {backup_info.display_name}
                </PageTitle>
            </div>
        }
        </>
    );
}