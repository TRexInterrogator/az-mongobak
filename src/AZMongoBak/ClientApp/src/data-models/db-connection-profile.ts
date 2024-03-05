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

    
    /**
     * Updates current connection profile
     * @param api 
     * @returns 
     */
    public async UpdateAsync(api: APIService): Promise<DBConnectionProfile | null> {

        let update: DBConnectionProfile | null = null;

        try {
            if (this.oid) {
                if (await api.InitAsync()) {
                    const headers = api.GetHeaders();
                    const url = `${api.BASE}/connectionProfiles/profile`;
                    const data = JSON.stringify(this);
                    const request = await fetch(url, { headers: headers, method: "PATCH", body: data });

                    if (request.ok) {
                        const json = await request.json() as IDBConnectionProfile;

                        if (json) {
                            update = DBConnectionProfile.CreateInstance(json);
                        }
                    }
                }
            }
        }
        catch (err) {
            console.error("DBConnectionProfile.UpdateAsync", err);
        }

        return update;
    }


    /**
     * Deletes current connection profile
     * @param api 
     * @returns 
     */
    public async DeleteAsync(api: APIService): Promise<boolean> {

        let deleted = false;

        try {
            if (this.oid) {
                if (await api.InitAsync()) {
                    const headers = api.GetHeaders();
                    const url = `${api.BASE}/connectionProfiles/profile?oid=${this.oid}`;
                    const request = await fetch(url, { headers: headers, method: "DELETE" });

                    if (request.ok) {
                        deleted = true;
                    }
                }
            }
        }
        catch (err) {
            console.error("DBConnectionProfile.DeleteAsync", err);
        }

        return deleted;
    }

    /**
     * Lists db names for current connection
     * @param api 
     * @returns 
     */
    public async ListDbsAsync(api: APIService): Promise<string[]> {

        let db_names: string[] = [];

        try {
            if (this.oid) {
                if (await api.InitAsync()) {
                    const url = `${api.BASE}/connectionProfiles/listDbs?oid=${this.oid}`;
                    const headers = api.GetHeaders();
                    const request = await fetch(url, { headers: headers });

                    if (request.ok) {
                        const json = await request.json() as string[];

                        if (json) {
                            db_names = json;
                        }
                    }
                }
            }
        }
        catch (err) {
            console.error("DBConnectionProfile.ListDbsAsync", err);
        }

        return db_names;
    }

    /**
     * Gets connection profile by given con-oid
     * @param oid 
     * @param api 
     * @returns 
     */
    public static async GetAsync(oid: string, api: APIService): Promise<DBConnectionProfile | null> {

        let profile: DBConnectionProfile | null = null;

        try {
            if (await api.InitAsync()) {
                const url = `${api.BASE}/connectionProfiles/byoid?oid=${oid}`;
                const headers = api.GetHeaders();
                const request = await fetch(url, { headers: headers });

                if (request.ok) {
                    const json = await request.json() as IDBConnectionProfile;

                    if (json) {
                        profile = DBConnectionProfile.CreateInstance(json);
                    }
                }
            }
        }
        catch (err) {
            console.error("DBConnectionProfile.GetAsync", err);
        }

        return profile;
    }
}