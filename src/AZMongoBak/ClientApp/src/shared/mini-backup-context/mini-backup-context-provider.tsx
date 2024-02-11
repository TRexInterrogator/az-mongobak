import { ReactNode, useEffect, useState } from "react";
import { MiniBackupInfo } from "../../data-models/mini-backup-info";
import { MiniBackupInfoContext } from "./mini-backup-context";
import { useQuery } from "@tanstack/react-query";
import { APIService } from "../../auth/api-service";
import { useMsal } from "@azure/msal-react";

interface IMiniBackupInfoProviderProps {
    children?: ReactNode;
}

export const MiniBackupInfoProvider = (props: IMiniBackupInfoProviderProps) => {

    const { instance, accounts } = useMsal();
    const [ api ] = useState(new APIService(instance, accounts));
    const [ infos, setInfos ] = useState<MiniBackupInfo[]>([]);

    const { data } = useQuery({
        queryKey: ["miniContext"],
        queryFn: async () => {
            const infos = await MiniBackupInfo.ListAsync(api);
            return infos;
        }
    });

    useEffect(() => {
        setInfos(data ?? []);
    }, [ data ]);

    
    return (
       <MiniBackupInfoContext.Provider value={{ infos: infos, update: setInfos }}>
            {props.children}
       </MiniBackupInfoContext.Provider>
    );
};