import { BackupJob, IBackupJob } from "./db-backup-job";

export interface IBackup {
	oid: string;
	date_created: string;
	blob_path: string;
	stored: boolean;
	job: IBackupJob;
}

export class Backup implements IBackup {

	public oid = "";
	public date_created = new Date().toISOString();
	public blob_path = "";
	public stored = false;
	public job = new BackupJob();

	public static CreateInstance(source: IBackup): Backup {
		const instance = new Backup();
		Object.assign(instance, source);
		instance.job = BackupJob.CreateInstance(source.job);
		return instance;
	}
}
