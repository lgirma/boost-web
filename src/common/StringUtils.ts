import {i18nService} from "../i18n";

export interface StringUtils {
    uuid(): string
    isEmpty(str: any): boolean
    humanize(str: string): string
    getFriendlyFileSize(bytes: number): string
    randomHash(): string
    fmt(str: string, ...args: any[]): string
}

export class DefaultStringUtils implements StringUtils {

    humanize(str: string) {
        return str
            .replace(/^[\s_]+|[\s_]+$/g, '')
            .replace(/[_\s]+/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/^[a-z]/, function(m) { return m.toUpperCase(); })
            .trim();
    }
    isEmpty(str: any) {
        return str == null || (str.trim && str.trim().length == 0);
    }
    uuid() {
        // UUID v4
        return (([1e7] as any)+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, (c: any) =>
            (c ^ globalThis.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    }
    randomHash() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8)
    }
    getFriendlyFileSize(bytes: number) {
        if (bytes < 1024)
            return bytes + ' ' + this._i18n._('BYTES')
        else if (bytes < (1024**2))
            return Math.round(10* bytes / 1024)/10 + ' ' + this._i18n._('KB')
        else if (bytes < (1024**3))
            return Math.round(10* bytes / (1024**2))/10 + ' ' + this._i18n._('MB')
        else if (bytes < (1024**4))
            return Math.round(10* bytes / (1024**3))/10 + ' ' + this._i18n._('GB')
        else
            return Math.round(10* bytes / (1024**4))/10 + ' ' + this._i18n._('TB')
    }
    fmt(str: string, ...args: any[]) {
        let result = str
        for (let i = 0; i < args.length; i++) {
            result = result.replace(`{${i}}`, args[i]);
        }
        return result
    }

    constructor(private _i18n: i18nService) {}
}