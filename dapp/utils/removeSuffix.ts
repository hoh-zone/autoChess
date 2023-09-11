export function removeSuffix(str: string): string {
    const regex = /[\d_]*$/;
    const match = str.match(regex);
    if (match) {
        return str.slice(0, match.index);
    }
    return str;
}
