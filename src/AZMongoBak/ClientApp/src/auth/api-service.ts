import { AccountInfo, IPublicClientApplication } from "@azure/msal-browser";

export class APIService {
    
    public BASE = import.meta.env.DEV ? "http://localhost:5001/api" : "/api";
    public ACCOUNT: AccountInfo | undefined;

    private _token = "";
    private readonly _instance: IPublicClientApplication;
    private readonly _accounts: AccountInfo[];

    constructor(instance: IPublicClientApplication, accounts: AccountInfo[]) {
        this._instance = instance;
        this._accounts = accounts;

        if (accounts.length > 0) {
            this.ACCOUNT = accounts[0];
        }
    }

    public GetHeaders(opt_headers?: any) {
        if (opt_headers) {
            return {
                "Content-Type": "application/json",
                "Authorization": this._token,
                ...opt_headers
            }
        }
        else {
            return {
                "Content-Type": "application/json",
                "Authorization": this._token
            }
        }
    }

    /**
     * Inits api-service before any call
     * Aquires new access token for api authorization
     * @returns 
     */
    public async InitAsync(): Promise<boolean> {

        let success = false;

        try {
            if (this._accounts.length > 0) {
                const account = this._accounts[0];
                const token = await this._instance.acquireTokenSilent({
                    scopes: [ import.meta.env.VITE_SCOPE ],
                    account: account
                });

                if (token && token.accessToken) {
                    this._token = `Bearer ${token.accessToken}`;
                    success = true;
                }
            }
        }
        catch (err) {
            console.error("APIService.InitAsync", err);
            success = false;
        }

        return success;
    }
}