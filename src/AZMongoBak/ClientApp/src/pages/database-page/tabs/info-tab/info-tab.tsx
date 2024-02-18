import { CodeReviewIcon, LinkIcon } from "@primer/octicons-react";
import { InfoBox } from "../../../../shared/info-box/info-box";
import { TDatabaseContextProps } from "../../database-context";

export const InfoTab = (props: TDatabaseContextProps) => {

    const { connection, backup_info } = props;

    return (
        <div>
            <InfoBox
                icon={<LinkIcon />}
                title={connection!.displayname}>
                <tr>
                    <td><b>Display name:</b></td>
                    <td><b>{connection!.displayname}</b></td>
                </tr>
                <tr>
                    <td><i>Connection:</i></td>
                    <td><i>{connection!.mongo_connection}</i></td>
                </tr>
                <tr>
                    <td>Oid:</td>
                    <td>{connection!.oid}</td>
                </tr>
            </InfoBox>

            <InfoBox
                style={{ marginTop: "20px" }}
                icon={<CodeReviewIcon />}
                title="Meta data">
                <tr>
                    <td>Date created:</td>
                    <td>{backup_info!.ToDateCreatedStr()}</td>
                </tr>
                <tr>
                    <td><b>Total backups:</b></td>
                    <td><b>{backup_info!.ToTotalBackups()}</b></td>
                </tr>
                <tr>
                    <td><i>Backups in storage:</i></td>
                    <td><i>{backup_info!.ToTotalBackupsStored()}</i></td>
                </tr>
            </InfoBox>
        </div>
    );
}