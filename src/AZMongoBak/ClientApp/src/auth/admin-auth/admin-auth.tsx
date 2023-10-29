import { useMsal } from "@azure/msal-react";
import { ReactNode, useEffect, useState } from "react";
import { APIService } from "../api-service";
import { VerifyAccessAsync } from "./admin-auth-helper";
import { PageTitle } from "../../shared/page-title/page-title";

interface IAdminAuthProps {
    children?: ReactNode;
}

export const AdminAuth = (props: IAdminAuthProps) => {

    const { instance, accounts } = useMsal();
    const [ api ] = useState(new APIService(instance, accounts));
    const [ is_loading, setLoading ] = useState(true);
    const [ authorized, setAuthorized ] = useState(false);

    useEffect(() => {
        (async () => {
            const is_authorized = await VerifyAccessAsync(api);
            setAuthorized(is_authorized);
            setLoading(false);
        })();
    }, []);

    return (
        <>
        { !is_loading &&
            <>
            { authorized ?
                <>
                {props.children}
                </>
                :
                <PageTitle>
                    401 Unauthorized - You are not allowed to use this application
                </PageTitle>
            }
            </>
        }
        </>
    );
}