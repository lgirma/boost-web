import {ConfigService} from "../src";
import {SessionStorageService} from "../src/session/SessionStorageService";

export function GetMockConfigService(initialConfig: any = {}): ConfigService {
    return {
        _config: initialConfig,
        get(section, defaultValue) {
            this._config[section] = {...defaultValue, ...this._config[section]}
            return this._config[section]
        }
    } as ConfigService
}

export function GetMockSessionStorageService(): SessionStorageService {
    return {
        _keyValues: {},
        getItem(key) {
            return JSON.parse(this._keyValues[key])
        },
        setItem(key, val) {
            this._keyValues[key] = JSON.stringify(val)
        },
        removeItem(key: string) {
            delete this._keyValues[key]
        }
    } as SessionStorageService
}