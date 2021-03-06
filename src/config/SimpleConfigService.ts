import {ConfigService, InitialConfig} from "./ConfigService";
import {deepMerge} from '../common'


export class SimpleConfigService implements ConfigService {
    private readonly _config = {}

    get<T = any>(section?: string, defaultValue?: T): T {
        if (this._config[section] == null)
            return this._config[section] = defaultValue
        return this._config[section] = deepMerge(defaultValue ?? {}, this._config[section])
    }

    constructor(initialConfig: InitialConfig) {
        this._config = initialConfig
    }
}