import { APIService } from "../auth/api-service";
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

	public ToDateStr(): string {
		return new Date(Date.parse(this.date_created)).toLocaleString();
	}

	/**
	 * Deletes this backup and remote data
	 * @param profile_oid 
	 * @param api 
	 * @returns 
	 */
	public async DeleteAsync(profile_oid: string, api: APIService): Promise<boolean> {

		let deleted = false;

		try {
			if (await api.InitAsync()) {
				const url = `${api.BASE}/backupJobs/deleteBak?profile=${profile_oid}&oid=${this.oid}`;
				const headers = api.GetHeaders();
				const request = await fetch(url, { headers: headers, method: "DELETE" });

				if (request.ok) {
					deleted = true;
				}
			}
		}
		catch (err) {
			console.error("Backup.DeleteAsync", err);
		}

		return deleted;
	}
}