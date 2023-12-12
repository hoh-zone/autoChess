export function removeSuffix(str: string | null | undefined): string {
    if (str == null || undefined) {
        return "";
    }
    const regex = /[\d_]*$/;
    const match = str.match(regex);
    if (match) {
        return str.slice(0, match.index);
    }
    return str;
}   

export function capitalizeFirstChar(str: String | undefined) : string {
    if (str == undefined) {
        return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
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
