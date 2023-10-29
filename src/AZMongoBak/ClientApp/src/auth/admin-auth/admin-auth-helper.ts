import { APIService } from "../api-service";

/**
 * Verifies if current user is allowed to use this app
 * @param api 
 * @returns 
 */
export const VerifyAccessAsync = async (api: APIService) => {

    let is_authorized = false;

    try {
        if (await api.InitAsync()) {
            const headers = api.GetHeaders();
            const url = `${api.BASE}/user/verfiyAccess`;
            const request = await fetch(url, { headers: headers });

            if (request.ok) {
                const json = await request.json();
                if (json && json === true) is_authorized = true;
            }
        }
    }
    catch (err) {
        console.error("AdminAuthHelper", err);
    }

    return is_authorized;
}