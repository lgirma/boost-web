const isObj = (item: any): boolean => {
    return item !== null && typeof item === 'object';
}

const isMergeAble = (item): boolean => {
    return isObj(item) && !Array.isArray(item);
}

export function deepMerge<T extends object = object>(target: T, ...sources: T[]): T {
    if (!sources.length)
        return target;

    const source = sources.shift();
    if (source === undefined)
        return target;

    if (isMergeAble(target) && isMergeAble(source)) {
        Object.keys(source).forEach(function(key: string) {
            if (isMergeAble(source[key])) {
                if (!target[key]) {
                    target[key] = {};
                }
                deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        });
    }

    return deepMerge(target, ...sources);
}

export type OneOrMany<T> = T | T[]
export type Nullable<T> = T | null | undefined
export type Dict<T> = Record<string, T>

/**
 * Matches date string in the formats YYYY/MM/DD or YYYY-MM-DD
 * @param str
 */
const dateRegex = '[1-2][0-9][0-9][0-9](\-|\/)[0-3][0-9](\-|\/)[0-3][0-9]'
const timeRegex = '([01][0-9]|2[0-3]):([012345][0-9])(:[012345][0-9])?'
export function isDate(str: string){
    return new RegExp(`^${dateRegex}$`).test(str);
}

export function isTime(str: string){
    return new RegExp(`^${timeRegex}$`).test(str);
}

export function isDateTime(str: string){
    const _regExp  = new RegExp(`^${dateRegex}\s${timeRegex}$`);
    return _regExp.test(str);
}

export function isYear(str: string){
    const _regExp  = new RegExp('^[1-2][0-9][0-9][0-9]$');
    return _regExp.test(str);
}

export function toArray<T>(src: T|T[]|null): T[] {
    if (src == null) return []
    if (Array.isArray(src))
        return src;
    else return [src]
}

export function swapKeyValues(obj: Dict<any>): Dict<string> {
    if (obj == null)
        return null
    return Object.keys(obj).reduce((prev, k) => ({...prev, [obj[k]]: k}), {})
}