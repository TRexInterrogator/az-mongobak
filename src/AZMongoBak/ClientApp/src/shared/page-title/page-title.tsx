import { Box, Text } from "@primer/react";
import { CSSProperties, ReactNode } from "react"

interface IPageTitleProps {
    style?: CSSProperties;
    children?: ReactNode;
    icon?: ReactNode;
    description?: string;
}

export const PageTitle = (props: IPageTitleProps) => {

    const { children, style, icon, description } = props;

    return (
        <Box 
            style={style}
            mt="30px">
            <div>
                { icon }
                <Text as="h1">{children}</Text>

                { description &&
                    <Text as="p">{description}</Text>
                }
            </div>
        </Box>
    );
}