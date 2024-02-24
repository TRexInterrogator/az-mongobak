
export interface IBackupJob {
    job_oid: string;
    date_start: string;
    date_end: string | null;
    done: boolean;
    output: string;
}

export class BackupJob implements IBackupJob {

    public job_oid = "";
    public date_start = new Date().toISOString();
    public date_end: string | null = null;
    public done = false;
    public output = "";

    public static CreateInstance(source: IBackupJob): BackupJob {
        const instance = new BackupJob();
        Object.assign(instance, source);
        return instance;
    }
}