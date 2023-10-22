import { APIService } from "../../../auth/api-service";

export const FetchUserPhotoAsync = async (api: APIService): Promise<string | null> => {

    let base64_photo: string | null = null;

    try {
        if (api.ACCOUNT && api.ACCOUNT.localAccountId) {
            if (await api.InitAsync()) {
                const headers = api.GetHeaders();
                const url = `${api.BASE}/user/photo?oid=${api.ACCOUNT.localAccountId}`;
                const request = await fetch(url, { headers: headers });

                if (request.ok) {
                    const json = await request.json();
                    if (json) base64_photo = json;
                }
            }
        }
    }
    catch (err) {
        console.error("FetchUserPhotoAsync", err);
    }

    return base64_photo;
}