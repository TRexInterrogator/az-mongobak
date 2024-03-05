import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DBConnectionProfile } from "../../data-models/db-connection-profile";
import { BackButton } from "../../shared/back-button/back-button";
import { Box, Button, FormControl, Text, TextInput } from "@primer/react";
import { SyncIcon, TrashIcon } from "@primer/octicons-react";
import { ErrorMessage } from "../../shared/messages/error-message";
import { APIService } from "../../auth/api-service";
import { useMsal } from "@azure/msal-react";

export const EditConnectionProfilePage = () => {

    const { state } = useLocation();
    const nav = useNavigate();
    const { instance, accounts } = useMsal();
    
    const [ api ] = useState(new APIService(instance, accounts));
    const [ profile, setProfile ] = useState<DBConnectionProfile>();
    const [ is_disabled, setDisabled ] = useState(false);
    const [ error_msg, setError ] = useState<string>();

    const [ field_con_name, setConnectionName ] = useState("");
    const [ field_con_str, setConnectionStr ] = useState("");

    useEffect(() => {
        if (state) {
            const db_profile = DBConnectionProfile.CreateInstance(state);
            setConnectionName(db_profile.displayname);
            setConnectionStr(db_profile.mongo_connection);
            setProfile(db_profile);
        }
    }, [ state ]);


    const HandleOnDelete = async () => {
        if (profile) {
            setError(undefined);
            setDisabled(true);

            if (await profile.DeleteAsync(api)) {
                nav("/connection/manage");
            }
            else {
                setError("Failed to delete current connection profile");
                setDisabled(false);
            }
        }
    };

    const HandleOnSave = async () => {
        if (profile) {
            if (field_con_name && field_con_str) {
                setDisabled(true);
                setError(undefined);

                profile.displayname = field_con_name;
                profile.mongo_connection = field_con_str;

                if (await profile.UpdateAsync(api)) {
                    setDisabled(false);
                }
                else {
                    setError("Failed to update current connection profile");
                    setDisabled(false);
                }
            }
        }
    };

    return (
        <div>
            <BackButton 
                style={{ marginTop: "30px" }}
                href="/connection/manage" />

            { profile &&
                <Box 
                    mt="20px" 
                    backgroundColor="#FFFFFF"
                    borderWidth={1}
                    borderColor="border.default"
                    borderStyle="solid"
                    borderRadius="6px"
                    p="30px">
                    <Box 
                        mb="30px"
                        borderWidth={1}
                        borderColor="border.default"
                        borderBottomStyle="solid" 
                        pb="3">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Text as="h1">
                                Edit profile
                            </Text>

                            <div>
                                <Button 
                                    onClick={HandleOnDelete}
                                    disabled={is_disabled}
                                    variant="danger"
                                    leadingIcon={() => <TrashIcon />}>
                                        Delete
                                </Button>
                            </div>
                        </div>
                    </Box>

                    <FormControl disabled={is_disabled}>
                        <FormControl.Label>Connection name:</FormControl.Label>
                        <TextInput 
                            onChange={e => setConnectionName(e.target.value)}
                            value={field_con_name}
                            type="text" 
                            block />
                    </FormControl>

                    <br />

                    <FormControl disabled={is_disabled}>
                        <FormControl.Label>Connection string:</FormControl.Label>
                        <TextInput
                            onChange={e => setConnectionStr(e.target.value)}
                            defaultValue={field_con_str}
                            type="text" 
                            block />
                    </FormControl>

                    <Button 
                        variant="primary"
                        onClick={HandleOnSave}
                        disabled={is_disabled}
                        style={{ marginTop: "20px" }}
                        leadingIcon={() => <SyncIcon />}
                        size="large">
                            Save changes
                    </Button>

                    <ErrorMessage 
                        message={error_msg}
                        style={{ marginTop: "20px" }} />
                </Box>
            }
        </div>
    );
}