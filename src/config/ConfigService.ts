export type InitialConfig = any

export interface ConfigService {
    get<T = any>(section?: string, defaultValue?: T): T
}

export class SimpleConfigService implements ConfigService {
    private _config = {}

    get<T = any>(section?: string, defaultValue?: T): T {
        if (this._config[section] == null)
            return this._config[section] = defaultValue
        return this._config[section] = {
            ...defaultValue,
            ...this._config[section]
        }
    }

    constructor(initialConfig: InitialConfig) {
        this._config = initialConfig
    }
}