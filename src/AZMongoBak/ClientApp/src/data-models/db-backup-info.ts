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
}
