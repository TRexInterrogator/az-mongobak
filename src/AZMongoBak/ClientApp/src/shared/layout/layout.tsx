import { PageLayout } from "@primer/react";
import { AppHeader } from "../app-header/app-header";
import { Account } from "./account/account";
import { ReactNode } from "react";

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
                { props.children }
            </PageLayout.Content>
        </PageLayout>
    );
}