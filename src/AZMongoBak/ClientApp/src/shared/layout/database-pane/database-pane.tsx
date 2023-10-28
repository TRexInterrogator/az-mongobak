import { Box, Text } from "@primer/react";

export const DatabasePane = () => {

    return (
        <Box
            p={3}
            mt="30px" 
            borderStyle="solid"
            borderWidth={1}
            borderRadius={2}
            borderColor="border.default"
            bg="var(--bg-color)">
            <Text sx={{ fontWeight: "bold" }}>Databases</Text>
        </Box>
    );
}