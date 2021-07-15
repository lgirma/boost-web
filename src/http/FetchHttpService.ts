import { ConfigService } from "../config/ConfigService";
import {HttpMethod, HttpService} from "./HttpService";

export class FetchHttpService extends HttpService {
    async request<T = any>(method: HttpMethod, url: string, body?: any, config?: RequestInit): Promise<T> {
        config = config || {};
        config.method = method || 'get';
        config.headers = config.headers || {};
        config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
        body ??= config.body
        if (body != null)
            config.body = body.constructor === FormData ? body : JSON.stringify(body)
        try {
            this.onRequesting.publish(config)
            let baseUrl = this._config.ApiBaseUrl
                ? `${this._config.ApiBaseUrl}/`
                : ''
            const response = await fetch(`${baseUrl}${url}`, config);
            if (!response.ok) {
                this.onResponseNotOk.publish(response)
                throw response
            }
            this.onResponseSuccess.publish(config)
            return await response.json()
        } catch (err) {
            this.onResponseError.publish(err)
            throw err;
        }
    }
    
    constructor(configService: ConfigService) {
        super(configService)
    }
}