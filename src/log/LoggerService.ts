export interface LoggerService {
    log(...messages: any[]): void
    error(...messages: any[]): void
    warn(...messages: any[]): void
}

export class EmptyLoggerService implements LoggerService {
    log() { }
    error() { }
    warn() { }
}