import {ApiError, HttpMethod, HttpService} from "../http";
import {Adapter} from "../common";

export interface DataSource {
    read<T = any>(adapter?: Adapter<T>): Promise<T>
}

export interface HttpDataSourceOptions {
    url: string
    method: HttpMethod
    errorHandler: (err: ApiError) => void
    httpOptions: RequestInit
}

export class ConstDataSource implements DataSource {
    constructor(private _data: any) {}

    read<T = any>(adapter?: Adapter<T>): Promise<T> {
        adapter ??= x => x
        return Promise.resolve(adapter(this._data));
    }
}

export class HttpDataSource implements DataSource {
    private _options: HttpDataSourceOptions
    constructor(url: string, body?: any, options?: Partial<HttpDataSourceOptions>) {
        this._options = {
            url,
            errorHandler: options?.errorHandler ?? (() => ({})),
            httpOptions: {
                ...options?.httpOptions,
                body: body ?? options?.httpOptions?.body
            },
            method: options?.method ?? (body == null ? 'get' : 'post'),
        }
    }

    async read<T = any>(adapter?: Adapter<T>): Promise<T> {
        adapter ??= x => x
        const _http = globalThis.c('http') as HttpService
        const _apiError = globalThis.c('api-error')

        try {
            const response = await _http.read(this._options.url, this._options.method,
                this._options.httpOptions.body, this._options.httpOptions)
            return adapter(response) as any
        }
        catch (e) {
            _apiError.handle(e, this._options.errorHandler)
            throw e
        }
    }
}