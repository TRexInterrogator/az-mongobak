import { APIService } from "../auth/api-service";

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


    /**
     * Saves this connection profile as new profile to db
     * @param api 
     * @returns 
     */
    public async CreateAsync(api: APIService): Promise<boolean> {

        let created = false;

        try {
            if (await api.InitAsync()) {
                const header = api.GetHeaders();
                const url = `${api.BASE}/connectionProfiles/new`;
                const data = JSON.stringify(this);
                const request = await fetch(url, { headers: header, method: "POST", body: data });

                if (request.ok) {
                    created = true;
                }
            }
        }
        catch (err) {
            console.error("DBConnectionProfile.SaveAsync", err);
        }

        return created;
    }

    /**
     * Lists all connection profiles
     * @param api 
     * @returns 
     */
    public static async ListAllAsync(api: APIService): Promise<DBConnectionProfile[]> {

        let profiles: DBConnectionProfile[] = [];

        try {
            if (await api.InitAsync()) {
                const headers = api.GetHeaders();
                const url = `${api.BASE}/connectionProfiles/list`;
                const request = await fetch(url, { headers: headers });

                if (request.ok) {
                    const json = await request.json() as IDBConnectionProfile[];

                    if (json) {
                        profiles = json.map(p => DBConnectionProfile.CreateInstance(p));
                    }
                }
            }
        }
        catch (err) {
            console.error("DBConnectionProfile.ListAllAsync", err);
        }

        return profiles;
    }
}