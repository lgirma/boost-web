import {AppEvent} from "../events";

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'patch';
export const enum HttpResponseBodyType {
    AUTO,
    JSON,
    TEXT,
    BLOB,
    FORM_DATA,
    ARRAY_BUFFER,
}

export interface HttpService {
    onRequesting: AppEvent<RequestInit>;
    onResponseSuccess: AppEvent<RequestInit>;
    onResponseNotOk: AppEvent<Response>;
    onResponseError: AppEvent<any>;

    get<T = any>(url: string, config?: RequestInit): Promise<T>
    post<T = any>(url: string, body: any, config?: RequestInit): Promise<T>
    read<T = any>(url: string, method: HttpMethod, body?: any, config?: RequestInit): Promise<T>
    request(method: HttpMethod, url: string, body?: any, config?: RequestInit): Promise<Response>
}

export const enum HttpErrorType {
    /**
     * Error before sending the request to the remote server
     */
    ERR_REQUEST,
    /**
     * The server could not be reached.
     */
    NO_CONNECTION,
    /**
     * Internal server error
     */
    ERR_5XX,
    /**
     * Server can be reached, but resource was not found on the server.
     */
    ERR_404,
    /**
     * Handle-able errors.
     */
    ERR_4XX
}

export interface HttpError {
    status?: number
    isHandleable: boolean
    type: HttpErrorType
    body?: any
}