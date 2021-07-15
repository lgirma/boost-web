import { ConfigService } from "../config/ConfigService";
import { AppEvent } from "../events/EventDispatch";

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'patch';

export abstract class HttpService {

    onRequesting = new AppEvent<RequestInit>()
    onResponseSuccess = new AppEvent<RequestInit>()
    onResponseNotOk = new AppEvent<Response>()
    onResponseError = new AppEvent<any>()
    _config: HttpConfig

    get<T = any>(url: string, config?: RequestInit): Promise<T> {
        return this.request<T>('get', url, null, config)
    }
    post<T = any>(url: string, body: any, config?: RequestInit): Promise<T> {
        return this.request<T>('post', url, body, config)
    }
    abstract request<T = any>(method: HttpMethod, url: string, body?, config?: RequestInit): Promise<T>

    constructor(configService: ConfigService) {
        this._config = configService.get<HttpConfig>('http', {ApiBaseUrl: ''})
    }
}

export interface HttpConfig {
    ApiBaseUrl?: string
}