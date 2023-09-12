export function removeSuffix(str: string): string {
    const regex = /[\d_]*$/;
    const match = str.match(regex);
    if (match) {
        return str.slice(0, match.index);
    }
    return str;
}

export function addLevelSuffix(str: string, level: number): string {
    if (level == 1) {
        return str + "1";
    } else if (level == 2) {
        return str + "1_1"
    } else if (level == 3) {
        return str + "2"
    } else if (level == 6) {
        return str + "2_1"
    } else if (level == 9) {
        return str + "3"
    }
    return str;
}
