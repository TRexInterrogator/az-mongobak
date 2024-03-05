import { Heading, Text } from "@primer/react";
import { CSSProperties } from "react";
import css from "./persona.module.css";

interface IPersonaProps {
    img?: string;
    name: string;
    with_name?: boolean;
    style?: CSSProperties;
}

export const Persona = (props: IPersonaProps) => {

    const { img, name, with_name, style } = props;

    return (
        <div style={style} className={css.persona}>
            { with_name &&
                <Text>{name}</Text>
            }

            { img ?
                <img
                    src={img}
                    draggable={false} 
                    className={css.profileImg} />
                :
                <div className={css.altName}>
                    <Heading sx={{ fontSize: 2 }}>
                        {name[0].toUpperCase()}
                    </Heading>
                </div>
            }
        </div>
    );
}