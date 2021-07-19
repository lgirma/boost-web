import { ConfigService } from "../config";
import {HttpMethod} from "./HttpService";
import {HttpServiceBase} from "./HttpServiceBase";

export class FetchHttpService extends HttpServiceBase {
    async request(method: HttpMethod, url: string, body?: any, config?: RequestInit): Promise<Response> {
        config = config || {};
        config.method = method || 'get';
        config.headers = config.headers || {};
        config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
        body ??= config.body
        if (body != null) {
            if (body.constructor === globalThis.FormData) {
                config.headers['Content-Type'] = 'multipart/form-data'
                config.body = body
            }
            else {
                config.body = JSON.stringify(body)
            }
        }

        this.onRequesting.publish(config)
        let baseUrl = this._config.apiBaseUrl
            ? `${this._config.apiBaseUrl}/`
            : ''
        if (globalThis.fetch) {
            let response: Response
            try {
                response = await fetch(`${baseUrl}${url}`, config);
            } catch (err) {
                this.onResponseError.publish(err)
                throw err;
            }
            if (!response.ok) {
                this.onResponseNotOk.publish(response)
                throw response
            }
            this.onResponseSuccess.publish(config)
            return response
        }
        else {
            throw 'fetch is not defined'
        }
    }
    
    constructor(configService: ConfigService) {
        super(configService)
    }
}