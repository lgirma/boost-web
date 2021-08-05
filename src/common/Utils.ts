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