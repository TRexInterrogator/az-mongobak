import { Box, Text } from "@primer/react";
import { CSSProperties, ReactNode } from "react";
import css from "./info-box.module.css";

interface IInfoBoxProps {
    title: string;
    icon: ReactNode;
    children?: ReactNode;
    style?: CSSProperties;
}

export const InfoBox = (props: IInfoBoxProps) => {

    const { style, title, icon, children } = props;

    return (
        <div style={style}>
            <Box 
                backgroundColor="#fff"
                borderColor="border.default"
                borderStyle="solid" 
                borderRadius={6}
                borderWidth={1}>
                <Box 
                    className={css.connectionInfoHead}
                    borderWidth={1}>
                    <Text fontWeight={600} as="p">
                        {icon}
                        {title}
                    </Text>
                </Box>
            
                <div style={{ padding: "16px" }}>
                    <table className={css.connectionInfoTable}>
                        <tbody>
                            {children}
                        </tbody>
                    </table>
                </div>
            </Box>
        </div>
    );
}