import { Box } from "@primer/react";
import { CSSProperties, ReactNode } from "react"

interface IPageTitleProps {
    style?: CSSProperties;
    children?: ReactNode;
}

export const PageTitle = (props: IPageTitleProps) => {

    const { children, style } = props;

    return (
        <Box 
            style={style}
            mt="30px"
            mb="10px"
            fontWeight={600}
            fontSize={30}
            pb="3">
            {children}
        </Box>
    );
}