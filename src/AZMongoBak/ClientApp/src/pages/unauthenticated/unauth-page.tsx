import { useMsal } from "@azure/msal-react";
import { SignInIcon } from "@primer/octicons-react";
import { Box, Button, Heading, PageLayout, Text } from "@primer/react";
import { LoginRequest } from "../../auth/msal-config";
import { AppHeader } from "../../shared/app-header/app-header";

export const UnauthPage = () => {

    const { instance } = useMsal();

    return (
        <>
        <PageLayout 
            padding="none" 
            rowGap="none" 
            columnGap="none"
            containerWidth="full">
            <PageLayout.Header 
                divider="line"
                padding="none">
                <AppHeader children_left={
                    <>
                    <Heading sx={{ fontSize: 2 }}>
                        /
                    </Heading>
                    <Heading sx={{ fontSize: 2 }}>
                        Login
                    </Heading>
                    </>
                } />
            </PageLayout.Header>
            <PageLayout.Content>
                <div style={{ margin: "40px 20px" }}>
                    <Box sx={{ 
                        maxWidth: "400px",
                        margin: "0 auto" }}>
                        <Text sx={{ display: "block", textAlign: "center" }}>
                            Sign in with your Microsoft Account
                        </Text>
                        <Button 
                            onClick={() => instance.loginRedirect(LoginRequest)}
                            size="large"
                            sx={{ display: "block", margin: "20px auto 0 auto" }}
                            leadingIcon={SignInIcon}>
                            Sign in
                        </Button>
                    </Box>
                </div>
            </PageLayout.Content>
        </PageLayout>
        </>
    );
}
