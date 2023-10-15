import { useMsal } from "@azure/msal-react";
import { SignInIcon } from "@primer/octicons-react";
import { Box, Button, Header, PageLayout, Text } from "@primer/react";
import { LoginRequest } from "../../auth/msal-config";


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
                <Header>
                    <Header.Item full>
                        <div style={{ margin: "0 auto" }}>
                            <Text sx={{ fontWeight: "600", fontSize: "1.15em" }}>MongoDb Backup - Login</Text>
                        </div>
                    </Header.Item>
                </Header>
            </PageLayout.Header>
            <PageLayout.Content>
                <div style={{ margin: "40px 20px" }}>
                    <Box sx={{ 
                        borderWidth: 1, 
                        borderStyle: "solid", 
                        p: 3,
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
