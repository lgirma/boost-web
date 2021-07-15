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

export abstract class ToastService {
    protected _i18n: i18nService

    abstract show(options?: ToastMessage);
    abstract hide();

    showSuccess(message: string, options?: ToastMessage) {
        this.show({
            title: this._i18n._('SUCCESS'),
            ...options,
            body: message,
            type: MessageType.SUCCESS
        });
    }

    showError(message: string, options?: ToastMessage) {
        this.show({
            title: this._i18n._('FAILED'),
            ...options,
            body: message,
            type: MessageType.ERROR
        });
    }

    showInfo(message: string, options?: ToastMessage) {
        this.show({
            title: this._i18n._('INFO'),
            ...options,
            body: message,
            type: MessageType.INFO
        });
    }

    showWarning(message: string, options?: ToastMessage) {
        this.show({
            title: this._i18n._('WARNING'),
            ...options,
            body: message,
            type: MessageType.WARNING
        });
    }

    constructor(i18n: i18nService) {
        this._i18n = i18n
    }
}