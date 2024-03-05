import { ReactNode } from "react";
import css from "./app-header.module.css";
import { Heading } from "@primer/react";
import { useNavigate } from "react-router-dom";

interface IAppHeaderProps {
    children_left?: ReactNode;
    children_right?: ReactNode;
}

export const AppHeader = (props: IAppHeaderProps) => {
    
    const nav = useNavigate();
    const { children_left, children_right } = props;

    return (
        <div className={css.header}>
            <div className={css.headerLeft}>
                <div 
                    onClick={() => nav("/")}
                    className={css.headerLogo}>
                    <div className={css.logo}>
                        <img
                            draggable={false} 
                            alt="logo" 
                            src="/logo192.png" />
                    </div>

                    <Heading sx={{ fontSize: 2 }}>
                        MongoDb Backup
                    </Heading>
                </div>

                { children_left }
            </div>
            <div>
                { children_right }
            </div>
        </div>
    );
}