import { LoggerService } from "./LoggerService";

export class ConsoleLoggerService implements LoggerService {
    log(...messages: any[]) {
        console.log(...messages)
    }
    error(...messages: any[]) {
        console.error(...messages)
    }
    warn(...messages: any[]) {
        console.warn(...messages)
    }
    
}