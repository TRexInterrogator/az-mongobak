import { InfoIcon } from "@primer/octicons-react";
import { IMessageProps } from "./message-props";
import css from "./message.module.css";

export const InfoMessage = (props: IMessageProps) => {

    const { message, style } = props;

    return (
        <>
            { message &&
                <div className={css.infoMessage} style={style}>
                    <InfoIcon size={20} />
                    <p>
                        {message}
                    </p>
                </div>
            }
        </>
    );
}