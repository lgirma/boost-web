import {SessionStorageService} from "./SessionStorageService";

export class LocalSessionStorageService implements SessionStorageService {
    getItem<T = string>(key: string): T | null {
        let result = globalThis.localStorage.getItem(key);
        if (result == null)
            return null
        return JSON.parse(result)
    }

    removeItem(key: string): void {
        globalThis.localStorage.removeItem(key);
    }

    setItem(key: string, value: any): void {
        globalThis.localStorage.setItem(key, JSON.stringify(value))
    }
}