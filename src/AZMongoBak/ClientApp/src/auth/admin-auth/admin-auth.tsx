import { useMsal } from "@azure/msal-react";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { PageTitle } from "../../shared/page-title/page-title";
import { APIService } from "../api-service";
import { VerifyAccessAsync } from "./admin-auth-helper";

interface IAdminAuthProps {
    children?: ReactNode;
}

export const AdminAuth = (props: IAdminAuthProps) => {

    const { instance, accounts } = useMsal();
    const [ api ] = useState(new APIService(instance, accounts));

    const { data } = useQuery({
        queryKey: ["admin_auth"],
        queryFn: async () => {
            const is_authorized = await VerifyAccessAsync(api);

            return {
                authorized: is_authorized
            }
        }
    });

    return (
        <>
        { data && data.authorized ?
            <>
            {props.children}
            </>
            :
            <PageTitle>
                401 Unauthorized - You are not allowed to use this application
            </PageTitle>
        }
        </>
    );
}