import {SessionStorageService} from "./SessionStorageService";
import {AppService} from "../app";

export class LocalSessionStorageService implements SessionStorageService {
    private readonly _app: AppService

    private getKey(key: string) {
        return `${this._app.getName()}_${key}`
    }

    getItem<T = any>(key: string): T | null {
        let result = globalThis.localStorage.getItem(this.getKey(key));
        if (result == null)
            return null
        return JSON.parse(result)
    }

    removeItem(key: string): void {
        globalThis.localStorage.removeItem(this.getKey(key));
    }

    setItem(key: string, value: any): void {
        globalThis.localStorage.setItem(this.getKey(key), JSON.stringify(value))
    }

    constructor(appService: AppService) {
        this._app = appService
    }
}