import {MessageType} from "./Common";

export interface IconOptions extends Partial<HTMLElement> {
    scale?: number
}

/* This cannot be portable. */
export interface IconService<TOptions extends IconOptions = IconOptions> {
    ico(key: string, options?: TOptions): string
    icoKey(message: MessageType): string
    icoForMsg(message: MessageType): string
}