import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { APIService } from "../../../auth/api-service";
import { FetchUserPhotoAsync } from "./account-helper";
import { Persona } from "../../persona/persona";
import css from "./account.module.css";
import { Button } from "@primer/react";
import { SignOutIcon } from "@primer/octicons-react";

export const Account = () => {

    const { instance, accounts } = useMsal();
    const [ api ] = useState(new APIService(instance, accounts));
    const [ profile_img, setProfileImg ] = useState<string>();
    const [ is_loading, setLoading ] = useState(true);
    const [ is_open, setOpen ] = useState(false);

    useEffect(() => {
        if (is_loading) {
            (async () => {
                const img_data = await FetchUserPhotoAsync(api);
                if (img_data) setProfileImg(img_data);
                setLoading(false);
            })();
        }
    }, [ api ]);

    const HandleOnSignOut = () => {
        localStorage.clear();
        sessionStorage.clear();
        instance.logoutRedirect();
    };

    return (
        <>
        { !is_loading &&
            <>
            <div
                onClick={() => setOpen(!is_open)} 
                className={css.personaBtn}>
                <Persona
                    with_name
                    img={profile_img}
                    name={api.account ? api.account.displayname : ""} />
            </div>

            { is_open &&
                <div className={css.logoutPanel}>
                    <div className={css.logoutPanelContent}>
                        <Button 
                            onClick={HandleOnSignOut}
                            leadingIcon={SignOutIcon}>
                            Sign out
                        </Button>
                    </div>
                </div>
            }
            </>
        }
        </>
    );
}