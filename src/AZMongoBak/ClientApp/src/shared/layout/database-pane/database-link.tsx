import { DatabaseIcon } from "@primer/octicons-react";
import { Link } from "@primer/react";
import { MiniBackupInfo } from "../../../data-models/mini-backup-info";
import { useNavigate } from "react-router-dom";

interface IDatabaseLinkProps {
    mini_info: MiniBackupInfo;
}

export const DatabaseLink = (props: IDatabaseLinkProps) => {

    const { mini_info } = props;
    const nav = useNavigate();

    return (
        <div style={{ 
            display: "flex", 
            alignItems: "center", 
            columnGap: "5px" 
        }}>
            <DatabaseIcon />
            <Link 
                style={{ cursor: "pointer" }}
                onClick={() => nav(`/database/manage?oid=${mini_info.oid}`)}>
                {mini_info.display_name}
            </Link>
        </div>
    );
}