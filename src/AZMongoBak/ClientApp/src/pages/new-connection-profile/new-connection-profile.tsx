import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DBConnectionProfile } from "../../data-models/db-connection-profile";
import { Box, Button, FormControl, Text, TextInput } from "@primer/react";
import { CheckIcon, LinkIcon } from "@primer/octicons-react";
import { InfoMessage } from "../../shared/messages/info-message";
import { ErrorMessage } from "../../shared/messages/error-message";
import { useMsal } from "@azure/msal-react";
import { APIService } from "../../auth/api-service";

export const NewConnectionProfilePage = () => {

    const nav = useNavigate();
    const { instance, accounts } = useMsal();
    const [ api ] = useState(new APIService(instance, accounts));

    const [ profile, setProfile ] = useState<DBConnectionProfile>(new DBConnectionProfile());
    const [ form_valid, setFormValid ] = useState(false);
    const [ is_disabled, setDisabled ] = useState(false);
    const [ is_creating, setCreating ] = useState(false);
    const [ has_error, setError ] = useState(false);


    const UpdateProfile = (new_profile: DBConnectionProfile) => {
        if (new_profile.IsValid()) {
            setProfile(new_profile);
            setFormValid(true);
        }
        else {
            setFormValid(false);
        }
    };

    const HandleDisplayNameChanged = (newval?: string) => {
        profile.displayname = newval ? newval : "";
        UpdateProfile(profile);
    };

    const HandleConnectionChanged = (newval?: string) => {
        profile.mongo_connection = newval ? newval : "";
        UpdateProfile(profile);
    };

    const HandleCreateClicked = async () => {
        if (profile.IsValid()) {
            setDisabled(true);
            setCreating(true);

            const is_admin = await DBConnectionProfile.TestAdminAsync(api);
            console.log("is admin", is_admin);

            // TODO: implement api

            /* const created = await profile.CreateNewProfileAsync();
            
            if (created) nav(`${ROUTE}/connection/manage`);
            else {
                setDisabled(false);
                setCreating(false);
                setError(true);
            } */
        }
    };

    return (
        <div>
            <Box mt="20px" >
                <div style={{ marginBottom: "30px" }}>
                    <LinkIcon size={24} />
                    <Text as="h1">New connection profile</Text>
                    <Text as="p">Create connection profiles for you database servers.</Text>
                </div>

                <FormControl disabled={is_disabled}>
                    <FormControl.Label>Connection name:</FormControl.Label>
                    <TextInput 
                        onChange={e => HandleDisplayNameChanged(e.target.value)}
                        type="text" 
                        block />
                </FormControl>

                <br />

                <FormControl disabled={is_disabled}>
                    <FormControl.Label>Connection string:</FormControl.Label>
                    <TextInput 
                        onChange={e => HandleConnectionChanged(e.target.value)}
                        type="text" 
                        block />

                    <FormControl.Caption>
                        e.g. mongodb://localhost:27017
                    </FormControl.Caption>
                </FormControl>

                <br />

                { !is_creating ?
                    <Button 
                        variant="primary"
                        onClick={HandleCreateClicked}
                        disabled={!form_valid}
                        style={{ marginTop: "20px" }}
                        leadingIcon={() => <CheckIcon size={20} />}
                        size="large">
                            Save profile
                    </Button>
                    :
                    <InfoMessage 
                        style={{ marginTop: "40px" }}
                        message="Creating profile .. Please wait." />
                }    
            </Box>

            { has_error &&
                <ErrorMessage 
                    style={{ marginTop: "20px" }}
                    message="Failed to create new connection profile." />
            }
        </div>
    );
}