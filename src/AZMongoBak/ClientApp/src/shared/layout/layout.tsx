import { PageLayout } from "@primer/react";
import { AppHeader } from "../app-header/app-header";
import { Account } from "./account/account";
import { ReactNode } from "react";
import { DatabasePane } from "./database-pane/database-pane";

interface ILayoutProps {
    children?: ReactNode;
}

export const Layout = (props: ILayoutProps) => {

    return (
        <PageLayout
            padding="none" 
            rowGap="none" 
            columnGap="none">
            <PageLayout.Header
                divider="line"
                padding="none">
                <AppHeader children_right={<Account />} />
            </PageLayout.Header>
            <PageLayout.Content>
                <div style={{ padding: "0px 24px 0px 24px" }}>
                    { props.children }
                </div>
            </PageLayout.Content>
            <PageLayout.Pane>
                <div style={{ padding: "0px 24px 0px 24px" }}>
                    <DatabasePane />
                </div>
            </PageLayout.Pane>
        </PageLayout>
    );
}