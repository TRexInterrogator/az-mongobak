import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DBConnectionProfile } from "../../data-models/db-connection-profile";

export const EditConnectionProfilePage = () => {

    const { state } = useLocation();
    const [ profile, setProfile ] = useState<DBConnectionProfile>();

    useEffect(() => {
        if (state) {
            setProfile(DBConnectionProfile.CreateInstance(state));
        }
    }, [ state ]);

    return (
        <>
        { profile &&
            <p>{profile.displayname}</p>
        }
        </>
    );
}