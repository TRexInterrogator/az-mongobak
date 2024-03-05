import { ArrowLeftIcon } from "@primer/octicons-react";
import { Button } from "@primer/react";
import { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

interface IBackButtonProps {
    style?: CSSProperties;
    href: string;
}

export const BackButton = (props: IBackButtonProps) => {

    const nav = useNavigate();

    return (
        <div style={props.style}>
            <Button 
                leadingIcon={() => <ArrowLeftIcon />}
                onClick={() => nav(props.href)}>
                Back
            </Button>
        </div>
    );
}