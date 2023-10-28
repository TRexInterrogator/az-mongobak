import { DatabaseIcon, LinkIcon } from "@primer/octicons-react";
import { ActionList } from "@primer/react";
import { useNavigate } from "react-router-dom";
import { LandingPageDocs } from "./landing-page-docs";
import { PageTitle } from "../../shared/page-title/page-title";

export const LandingPage = () => {

    const nav = useNavigate();

    return (
        <div>
            <PageTitle>
                Getting started
            </PageTitle>

            <ActionList>
                <ActionList.LinkItem 
                    style={{ margin: "2px 0px", fontWeight: "600" }} 
                    onClick={() => nav("/database/new")}>
                        <ActionList.LeadingVisual>
                            <DatabaseIcon />
                        </ActionList.LeadingVisual>
                        Add new database
                </ActionList.LinkItem>

                <ActionList.LinkItem 
                    style={{ margin: "2px 0px", fontWeight: "600" }} 
                    onClick={() => nav("/connection/manage")}>
                        <ActionList.LeadingVisual>
                            <LinkIcon />
                        </ActionList.LeadingVisual>
                        Manage connection profiles
                </ActionList.LinkItem>
            </ActionList>

            <LandingPageDocs />
        </div>
    );
}