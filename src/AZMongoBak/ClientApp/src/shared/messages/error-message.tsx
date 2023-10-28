import { ShieldXIcon } from "@primer/octicons-react";
import { IMessageProps } from "./message-props";
import css from "./message.module.css";

export const ErrorMessage = (props: IMessageProps) => {
    
    const { message, style } = props;

    return (
        <>
        { message &&
            <div className={css.errorMessage} style={style}>
                <ShieldXIcon size={20} />
                <p>
                    {message}
                </p>
            </div>
        }
        </>
    );
}