import { Box, Button, FormControl, TextInput } from "@primer/react";
import { PageTitle } from "../../shared/page-title/page-title";
import { CheckIcon, DatabaseIcon } from "@primer/octicons-react";
import { ConnectionProfileSelect } from "./select-connection/select-connection";
import { useMsal } from "@azure/msal-react";
import { APIService } from "../../auth/api-service";
import { useState } from "react";
import { DBConnectionProfile } from "../../data-models/db-connection-profile";
import { DatabaseSelect } from "./select-database/select-database";

// TODO: Work on database connection form

export const NewDataBasePage = () => {

    const { instance, accounts } = useMsal();
    const [ api ] = useState(new APIService(instance, accounts));
    const [ form_disabled, setFormDisabled ] = useState(false);
    const [ db_names, setDbNames ] = useState<string[]>();
    const [ validation_result, setValidationResult ] = useState<string>();
    
    const [ selected_db, setSelectedDb ] = useState<string>();
    const [ friendly_name, setFriendlyName ] = useState<string>();
    const [ retention, setRetention ] = useState(10);

    const HandleOnProfileChanged = async (profile: DBConnectionProfile) => {
        setDbNames(await profile.ListDbsAsync(api));
    };
    

    return (
        <Box mt="20px">
            <PageTitle
                icon={<DatabaseIcon size={24} />}
                description="Add a database to backup schedule">
                New database
            </PageTitle>

            <div style={{ 
                display: "flex", 
                alignItems: "center", 
                columnGap: "30px",
                marginTop: "50px" }}>
                <ConnectionProfileSelect 
                    disabled={form_disabled}
                    onChange={HandleOnProfileChanged}
                    api={api} />

                { db_names &&
                    <DatabaseSelect 
                        onChange={setSelectedDb}
                        disabled={form_disabled}
                        dbs={db_names} />
                }
            </div>
            
            { selected_db &&
                <div>
                    <br />

                    <FormControl disabled={form_disabled}>
                        <FormControl.Label required>
                            Friendly name
                        </FormControl.Label>
                        <TextInput 
                            onChange={e => setFriendlyName(e.target.value)}
                            width="100%"
                            type="text" />

                        { validation_result === "noName" &&
                            <FormControl.Validation variant="error">
                                Field cannot be empty
                            </FormControl.Validation>
                        }                        
                    </FormControl>

                    <br />

                    <FormControl disabled={form_disabled}>
                        <FormControl.Label htmlFor="retention" required>
                            Retention time in days
                        </FormControl.Label>
                        <TextInput
                            onChange={e => setRetention(Number.parseInt(e.target.value))}
                            defaultValue={10}
                            width="100%"
                            type="number"/>

                        { validation_result === "noRetention" &&
                            <FormControl.Validation variant="error">
                                Field cannot be empty
                            </FormControl.Validation>
                        }

                        { validation_result === "noRetentionNeg" &&
                            <FormControl.Validation variant="error">
                                Minimum value must be 1 day
                            </FormControl.Validation>
                        }
                    </FormControl>

                    <Button 
                        size="large"
                        style={{ marginTop: "20px" }}
                        leadingIcon={() => <CheckIcon size={20} />}
                        disabled={form_disabled}
                        variant="primary">
                        Save backup profile
                    </Button>
                </div>
            }

        </Box>
    );
}