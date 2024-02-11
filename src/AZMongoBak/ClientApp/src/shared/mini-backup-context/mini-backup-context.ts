import { createContext } from "react";
import { MiniBackupInfo } from "../../data-models/mini-backup-info";


interface IMiniBackupInfoContext {
    infos: MiniBackupInfo[];
    update: (update: MiniBackupInfo[]) => void;
}

export const MiniBackupInfoContext = createContext<IMiniBackupInfoContext>({
    infos: [],
    update: () => {}
});