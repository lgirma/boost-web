export interface HttpService {
    get<T = any>(url: string, init?: RequestInit): Promise<T>
    post<T = any>(url: string, body: any, init?: RequestInit): Promise<T>
}