export type InitialConfig = any

export interface ConfigService {
    get<T = any>(section?: string, defaultValue?: T): T
}

export function configFor<T>(value: T): T {return value}