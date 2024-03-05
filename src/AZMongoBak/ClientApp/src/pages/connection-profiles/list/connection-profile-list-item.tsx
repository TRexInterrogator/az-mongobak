import { useNavigate } from "react-router-dom";
import { DBConnectionProfile } from "../../../data-models/db-connection-profile";
import { Box, Text } from "@primer/react";
import { ArrowBothIcon } from "@primer/octicons-react";
import css from "./list.module.css";

interface IConnectionProfileListItemProps {
    profile: DBConnectionProfile;
}

export const ConnectionProfileListItem = (props: IConnectionProfileListItemProps) => {

    const nav = useNavigate();
    const { profile } = props;

    return (
        <Box 
            p="10px 16px"
            borderTopStyle="solid"
            borderWidth={1}
            borderColor="border.default"
            className={css.listItem}>
            <div id="lr">
                <Text 
                    as="p" 
                    id="link" 
                    onClick={() => nav("/connection/edit", { state: profile })}>
                        <ArrowBothIcon />
                        { profile.displayname }
                </Text>
                <Text as="p">
                    { profile.ToDateCreatedStr() }
                </Text>
            </div>
        </Box>
    );
}