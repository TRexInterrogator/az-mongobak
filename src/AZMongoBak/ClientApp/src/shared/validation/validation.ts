
export const StrNotEmpty = (s: string | undefined | null): boolean => {
    if (s) return /\S/.test(s);
    else return false;
}