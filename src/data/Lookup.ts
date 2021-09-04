import {Adapter} from "../common";
import {DataSource, HttpDataSource} from "./DataSource";
import {ConfigService} from "../config";

export interface LookupItem {
    key: any
    val: string
}

export type LookupAdapter = Adapter<LookupItem[]>

export interface LookupService {
    getFrom(dataSource: DataSource): Promise<LookupItem[]>
    get(id: string): Promise<LookupItem[]>
    fromEnumValues(values: string[], zeroBased?: boolean): LookupItem[]
}

export interface LookupConfig {
    adapter?: LookupAdapter
    getUrl?: (id: string) => string
}

export class LookupServiceImpl implements LookupService {
    private _config: LookupConfig

    async getFrom(dataSource: DataSource): Promise<LookupItem[]> {
        return await dataSource.read<LookupItem[]>(this._config.adapter)
    }

    async get(id: string): Promise<LookupItem[]> {
        return await this.getFrom(new HttpDataSource(this._config.getUrl(id)))
    }

    constructor(config: ConfigService) {
        this._config = config.get<LookupConfig>('lookup', {
            adapter: x => x,
            getUrl: id => `lookup/${id}-list`
        })
    }

    fromEnumValues(values: string[], zeroBased = true): LookupItem[] {
        return values
            .map((v, i) => ({key: i + (zeroBased ? 0 : 1), val: v}))
    }
}