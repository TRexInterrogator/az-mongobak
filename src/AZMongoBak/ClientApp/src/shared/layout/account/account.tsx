import { useMsal } from "@azure/msal-react";
import { SignOutIcon } from "@primer/octicons-react";
import { Button } from "@primer/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { APIService } from "../../../auth/api-service";
import { Persona } from "../../persona/persona";
import { FetchUserPhotoAsync } from "./account-helper";
import css from "./account.module.css";

export const Account = () => {

    const { instance, accounts } = useMsal();
    const [ api ] = useState(new APIService(instance, accounts));
    const [ is_open, setOpen ] = useState(false);

    const { data } = useQuery({
        queryKey: ["accountpic"],
        queryFn: async () => {
            const img_data = await FetchUserPhotoAsync(api);

            return {
                img: img_data ?? undefined
            }
        }
    });


    const HandleOnSignOut = () => {
        localStorage.clear();
        sessionStorage.clear();
        instance.logoutRedirect();
    };

    return (
        <>
        { data &&
            <>
            <div
                onClick={() => setOpen(!is_open)} 
                className={css.personaBtn}>
                <Persona
                    with_name
                    img={data.img}
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