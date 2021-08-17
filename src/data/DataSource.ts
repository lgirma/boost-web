import {ApiError, HttpMethod, HttpService} from "../http";

export interface DataSource {
    read<T = any>(): Promise<T>
}

export interface HttpDataSourceOptions {
    url: string
    method: HttpMethod
    errorHandler: (err: ApiError) => void
    httpOptions: RequestInit
}

export class ConstDataSource implements DataSource {
    constructor(private _data: any) {}

    read<T = any>(): Promise<T> {
        return Promise.resolve(this._data);
    }
}

export class HttpDataSource implements DataSource {
    private _options: HttpDataSourceOptions
    constructor(url: string, options?: Partial<HttpDataSourceOptions>) {
        this._options = {
            url,
            errorHandler: options?.errorHandler ?? (() => ({})),
            httpOptions: options?.httpOptions ?? {},
            method: options?.method ?? 'get'
        }
    }

    async read<T = any>(): Promise<T> {
        const _http = globalThis.c('http') as HttpService
        const _apiError = globalThis.c('api-error')

        try {
            return (await _http.request(this._options.method, this._options.url,
                this._options.httpOptions.body, this._options.httpOptions)) as any
        }
        catch (e) {
            _apiError.handle(e, this._options.errorHandler)
            throw e
        }
    }
}