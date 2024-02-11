import { APIService } from "../auth/api-service";

export class MiniBackupInfo {

    public oid = "";
    public display_name = "";

    public static async ListAsync(api: APIService): Promise<MiniBackupInfo[]> {

        let infos: MiniBackupInfo[] = [];

        try {
            if (await api.InitAsync()) {
                const header = api.GetHeaders();
                const url = `${api.BASE}/backupInfo/list-mini`;
                const request = await fetch(url, { headers: header });

				if (request.ok) {
                    infos = await request.json() as MiniBackupInfo[];
                }
            }
        }
        catch (err) {
            console.error("MiniBackupInfo.ListAsync", err);
        }

        return infos;
    }
}