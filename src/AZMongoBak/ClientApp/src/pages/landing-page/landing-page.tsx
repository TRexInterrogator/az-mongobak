import { DatabaseIcon, LinkIcon } from "@primer/octicons-react";
import { ActionList } from "@primer/react";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../shared/page-title/page-title";
import { LandingPageDocs } from "./landing-page-docs";

export const LandingPage = () => {

    const nav = useNavigate();

    return (
        <div>
            <PageTitle style={{ marginBottom: "20px" }}>
                Getting started
            </PageTitle>

            <ActionList>
                <ActionList.LinkItem 
                    style={{ fontWeight: "600" }} 
                    onClick={() => nav("/database/new")}>
                        <ActionList.LeadingVisual>
                            <DatabaseIcon />
                        </ActionList.LeadingVisual>
                        Add new database
                </ActionList.LinkItem>

                <ActionList.LinkItem 
                    style={{ fontWeight: "600" }} 
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