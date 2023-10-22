import { useMsal } from "@azure/msal-react";
import { Avatar } from "@primer/react";
import { useEffect, useState } from "react";
import { APIService } from "../../../auth/api-service";
import { FetchUserPhotoAsync } from "./account-helper";

export const Account = () => {

    const { instance, accounts } = useMsal();
    const [ api ] = useState(new APIService(instance, accounts));
    const [ profile_img, setProfileImg ] = useState("https://avatars.githubusercontent.com/primer");
    const [ is_loading, setLoading ] = useState(true);

    useEffect(() => {
        if (is_loading) {
            (async () => {
                const img_data = await FetchUserPhotoAsync(api);
                if (img_data) setProfileImg(img_data);
                setLoading(false);
            })();
        }
    }, [ api ]);

    return (
        <>
        { !is_loading &&
            <>
             <Avatar 
                square
                size={32}
                src={profile_img} />
            </>
        }
        </>
    );
}