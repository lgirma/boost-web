export type InitialConfig = any

export class ConfigService {
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