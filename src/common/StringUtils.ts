import {i18nService} from "../i18n";

export interface StringUtils {
    uuid(): string
    isEmpty(str: any): boolean
    humanize(str: string): string
    humanized_i18n(str: string): string
    getFriendlyFileSize(bytes: number): string
    randomHash(): string
    fmt(str: string, ...args: any[]): string
    xssSafe(str: string): string
    padZeros(n: number, width?: number): string
}

export class DefaultStringUtils implements StringUtils {

    humanize(str: string) {
        if (this.isEmpty(str))
            return ''
        return str
            .replace(/^[\s_]+|[\s_]+$/g, '')
            .replace(/[_\s\-]+/g, ' ')
            .replace(/([a-z_])([A-Z])/g, '$1 $2')
            .replace(/^[a-z]/,  m => m.toUpperCase())
            .trim();
    }
    humanized_i18n(str: string): string {
        if (this.isEmpty(str))
            return ''
        const humanized = this.humanize(str)
        const key = humanized.replace(/\s/g, '_').toUpperCase()
        let val = this._i18n.exact(key)
        if (val != null) return val
        return humanized
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
    xssSafe(str: string) {
        if (str == null)
            return str
        return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27')
            .replace(/\//g, '&#x2F');
    }

    padZeros(n: number, width = 5): string
    {
        const numStr = n.toString()
        if (numStr.padStart != null)
            return numStr.padStart(width, "0")
        width -= numStr.length;
        if (width > 0)
        {
            return new Array( width + (/\./.test( numStr ) ? 2 : 1) ).join( '0' ) + n;
        }
        return numStr;
    }

    constructor(private _i18n: i18nService) {}
}