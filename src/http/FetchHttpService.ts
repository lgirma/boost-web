import {HttpService} from "./HttpService";

export class FetchHttpService implements HttpService {
    async get<T = any>(url: string, init?: RequestInit): Promise<T> {
        let response = await fetch(url, {method: 'GET', ...init})
        if (response.ok)
            return await response.json()
        else throw `Request failed: ${response.status}`
    }

    async post<T = any>(url: string, body: any, init?: RequestInit): Promise<T> {
        let response = await fetch(url, {method: 'POST', body, ...init})
        if (response.ok)
            return await response.json()
        else throw `Request failed: ${response.status}`
    }

}