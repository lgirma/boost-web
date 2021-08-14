import {AppConfig, AppService} from "./AppService";
import {ConfigService} from "../config";

export class SvelteAppService implements AppService {
    private readonly _config: AppConfig

    getInfo(): AppConfig {return this._config}

    getName(): string {return this._config.name}

    constructor(configService: ConfigService) {
        this._config = configService.get<AppConfig>('app', {
            name: 'BoostWeb',
            year: 2021,
            version: '1.0.0'
        })
    }

    start(page: any) {
        new page({
            target: globalThis.document.getElementById('app')!
        })
    }
}