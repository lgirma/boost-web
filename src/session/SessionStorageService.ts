export interface SessionStorageService {
    getItem<T = any>(key: string): T | null
    removeItem(key: string): void
    setItem(key: string, value: any): void
}