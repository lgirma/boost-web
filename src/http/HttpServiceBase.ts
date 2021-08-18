import {AppEvent} from "../events";
import {ConfigService} from "../config";
import {HttpMethod, HttpService} from "./HttpService";
import {tryReadBody} from "./HttpUtils";

export abstract class HttpServiceBase implements HttpService {
    onRequesting = new AppEvent<RequestInit>()
    onResponseSuccess = new AppEvent<RequestInit>()
    onResponseNotOk = new AppEvent<Response>()
    onResponseError = new AppEvent<any>()
    protected _config: HttpConfig

    async get<T = any>(url: string, config?: RequestInit): Promise<T> {
        return await this.read<T>(url, 'get', null, config)
    }

    async post<T = any>(url: string, body: any, config?: RequestInit): Promise<T> {
        return await this.read<T>(url, 'post', body, config)
    }

    async read<T = any>(url: string, method: HttpMethod, body?: any, config?: RequestInit): Promise<T> {
        const response = await this.request(method, url, body, config)
        return await tryReadBody(response)
    }

    abstract request(method: HttpMethod, url: string, body?: any, config?: RequestInit): Promise<Response>

    protected constructor(configService: ConfigService) {
        this._config = configService.get<HttpConfig>('http',
            {apiBaseUrl: ''})
    }
}

export interface HttpConfig {
    apiBaseUrl?: string
    errorCodeKey?: string
    errorDetailsKey?: string
}