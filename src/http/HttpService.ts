import {AppEvent} from "../events";

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'patch';

export interface HttpService {
    onRequesting: AppEvent<RequestInit>;
    onResponseSuccess: AppEvent<RequestInit>;
    onResponseNotOk: AppEvent<Response>;
    onResponseError: AppEvent<any>;

    get<T = any>(url: string, config?: RequestInit): Promise<T>;
    post<T = any>(url: string, body: any, config?: RequestInit): Promise<T>;
    request(method: HttpMethod, url: string, body?: any, config?: RequestInit): Promise<Response>;
}