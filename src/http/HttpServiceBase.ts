import {AppEvent} from "../events";
import {ConfigService} from "../config";
import {HttpMethod, HttpService} from "./HttpService";

async function getContent(response: Response) {
    const txtResponse = await response.text()
    if (txtResponse == null)
        return null
    try {
        return JSON.parse(txtResponse)
    } catch (e) {
        return txtResponse as any
    }
}

export abstract class HttpServiceBase implements HttpService {
    onRequesting = new AppEvent<RequestInit>()
    onResponseSuccess = new AppEvent<RequestInit>()
    onResponseNotOk = new AppEvent<Response>()
    onResponseError = new AppEvent<any>()
    protected _config: HttpConfig

    async get<T = any>(url: string, config?: RequestInit): Promise<T> {
        const response = await this.request('get', url, null, config)
        return await getContent(response)
    }

    async post<T = any>(url: string, body: any, config?: RequestInit): Promise<T> {
        const response = await this.request('post', url, body, config)
        return await getContent(response)
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