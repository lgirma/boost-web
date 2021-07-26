export interface AppService {
    getInfo(): AppConfig
    getName(): string
}

export interface AppConfig {
    name: string
    title?: string
    version?: string
    year?: number
    publisher?: string
}