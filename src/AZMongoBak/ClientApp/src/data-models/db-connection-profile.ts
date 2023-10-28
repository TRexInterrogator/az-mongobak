
export interface IDBConnectionProfile {
    oid: string;
    displayname: string;
    mongo_connection: string;
    date_created: string;
}

export class DBConnectionProfile implements IDBConnectionProfile {

    public oid = "";
    public displayname = "";
    public mongo_connection = "";
    public date_created = new Date().toISOString();

    public static CreateInstance(source: IDBConnectionProfile): DBConnectionProfile {
        const instance = new DBConnectionProfile();
        Object.assign(instance, source);
        return instance;
    }

    public IsValid(): boolean {
        return this.displayname && this.mongo_connection ? true : false;
    }

    public ToDateCreatedStr(): string {
        return new Date(Date.parse(this.date_created)).toLocaleString();
    }
}