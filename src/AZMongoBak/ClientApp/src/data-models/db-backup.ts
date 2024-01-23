export interface IBackup {
	oid: string;
	date_created: string;
	blob_path: string;
	stored: boolean;
}

export class Backup implements IBackup {

	public oid = "";
	public date_created = new Date().toISOString();
	public blob_path = "";
	public stored = false;

	public static CreateInstance(source: IBackup): Backup {
		const instance = new Backup();
		Object.assign(instance, source);
		return instance;
	}
}
