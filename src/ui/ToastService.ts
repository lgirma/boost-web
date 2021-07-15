import { i18nService } from "../i18n/i18nService";
import { ScreenPosition, MessageType } from "./Common";

export interface ToastMessage {
    type?: MessageType
    autoHide?: boolean
    timeout?: number
    title?: string
    titleDescription?: string
    body?: string
    bodyHtml?: boolean
    position?: ScreenPosition
}

let _: (key: string, ...args) => string

export abstract class ToastService {
    abstract show(options?: ToastMessage);
    abstract hide();

    showSuccess(message: string, options?: ToastMessage) {
        this.show({
            title: _('SUCCESS'),
            ...options,
            body: message,
            type: MessageType.SUCCESS
        });
    }

    showError(message: string, options?: ToastMessage) {
        this.show({
            title: _('FAILED'),
            ...options,
            body: message,
            type: MessageType.ERROR
        });
    }

    showInfo(message: string, options?: ToastMessage) {
        this.show({
            title: _('INFO'),
            ...options,
            body: message,
            type: MessageType.INFO
        });
    }

    showWarning(message: string, options?: ToastMessage) {
        this.show({
            title: _('WARNING'),
            ...options,
            body: message,
            type: MessageType.WARNING
        });
    }

    constructor(i18n: i18nService) {
        _ = i18n._
    }
}