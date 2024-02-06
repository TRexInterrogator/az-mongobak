import { APIService } from "../auth/api-service";
import { Backup, IBackup } from "./db-backup";

interface IBackupInfo {
	oid: string;
	display_name: string;
	database: string;
	connection_profile: string;
	backups: IBackup[];
	retention_days: number;
	date_created: string;
}

export class BackupInfo implements IBackupInfo {

	public oid = "";
	public display_name = "";
	public database = "";
	public connection_profile = "";
	public backups: Backup[] = [];
	public retention_days = 0;
	public date_created = new Date().toISOString();

	public static CreateInstance(source: IBackupInfo): BackupInfo {
		const instance = new BackupInfo();
		Object.assign(instance, source);
        instance.backups = source.backups.map(b => Backup.CreateInstance(b));
		return instance;
	}

	/**
	 * Saves current item to database (creates new if oid empty)
	 * @param api 
	 * @returns 
	 */
	public async SaveAsync(api: APIService): Promise<BackupInfo | null> {

		let saved: BackupInfo | null = null;

		try {
			if (await api.InitAsync()) {
				const header = api.GetHeaders();
                const url = `${api.BASE}/backupInfo/save`;
                const data = JSON.stringify(this);
                const request = await fetch(url, { headers: header, method: "POST", body: data });

				if (request.ok) {
					const json = await request.json() as IBackupInfo;

					if (json) {
						saved = BackupInfo.CreateInstance(json);
					}
				}
			}
		}
		catch (err) {
			console.error("BackupInfo.SaveAsync", err);
		}

		return saved;
	}

	/**
	 * Fetches backup info from api by oid
	 * @param oid 
	 * @param api 
	 * @returns 
	 */
	public static async GetByOidAsync(oid: string, api: APIService): Promise<BackupInfo | null> {

		let info: BackupInfo | null = null;

		try {
			if (await api.InitAsync()) {
				const header = api.GetHeaders();
                const url = `${api.BASE}/backupInfo/byOid?oid=${oid}`;
				const request = await fetch(url, { headers: header });

				if (request.ok) {
					const json = await request.json() as IBackupInfo;

					if (json) {
						info = BackupInfo.CreateInstance(json);
					}
				}
			}
		}
		catch (err) {
			console.error("BackupInfo.GetByOidAsync", err);
		}

		return info;
	}

	/**
	 * Deletes current backup info with all remove backups
	 * @param api 
	 * @returns 
	 */
	public async DeleteAsync(api: APIService): Promise<boolean> {

		let deleted = false;

		try {
			if (await api.InitAsync()) {
				const header = api.GetHeaders();
                const url = `${api.BASE}/backupInfo/remove?oid=${this.oid}`;
				const request = await fetch(url, { headers: header, method: "DELETE" });

				if (request.ok) {
					deleted = true;
				}
			}
		}
		catch (err) {
			console.error("BackupInfo.DeleteAsync", err);
		}

		return deleted;
	}
}
