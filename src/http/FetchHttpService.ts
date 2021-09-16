import {ConfigService} from "../config";
import {HttpError, HttpErrorType, HttpMethod} from "./HttpService";
import {HttpServiceBase} from "./HttpServiceBase";
import {tryReadBody} from "./HttpUtils";


export class FetchHttpService extends HttpServiceBase {
    httpError(type: HttpErrorType, status?: number, body?: any): HttpError {
        const result = {type, status, body, isHandleable: false}
        result.isHandleable = (body && type == HttpErrorType.ERR_4XX)
        if (!this._config.skipLoggingErrors)
            console.error('Http Error', result)
        return result
    }
    async httpErrorFromResp(response: Response): Promise<HttpError> {
        let type = HttpErrorType.ERR_4XX
        if (response.status >= 500)
            type = HttpErrorType.ERR_5XX
        else if (response.status == 404)
            type = HttpErrorType.ERR_404
        return this.httpError(type, response.status, await tryReadBody(response))
    }

    async request(method: HttpMethod, url: string, body?: any, config?: RequestInit): Promise<Response> {
        config = config || {};
        config.method = method || 'get';
        config.headers = config.headers || {};
        body ??= config.body
        if (body != null) {
            if (body.constructor === globalThis.FormData) {
                //config.headers['Content-Type'] = undefined
                config.body = body
            }
            else {
                config.headers['Content-Type'] ??= 'application/json';
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
                throw this.httpError(HttpErrorType.NO_CONNECTION, 0, err)
            }
            if (!response.ok) {
                this.onResponseNotOk.publish(response)
                throw await this.httpErrorFromResp(response)
            }
            this.onResponseSuccess.publish(config)
            return response
        }
        else {
            throw this.httpError(HttpErrorType.ERR_REQUEST, null, 'Fetch is not defined')
        }
    }
    
    constructor(config: ConfigService) {
        super(config)
    }
}