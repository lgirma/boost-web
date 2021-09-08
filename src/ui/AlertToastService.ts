import {i18nService} from "../i18n";
import {MessageType, ToastService, ToastState} from ".";

export class AlertToastService implements ToastService {

    constructor(private _i18n: i18nService) {}

    hide() {}

    show(detailKey: string, titleKey: string, _: MessageType, _1?: ToastState) {
        globalThis.alert(`${this._i18n._(titleKey)}\n${this._i18n._(detailKey)}`)
    }
    showError(messageKey?: string, options?: ToastState) {
        this.show(messageKey ?? 'FAILED', options.titleKey, MessageType.ERROR, options)
    }
    showInfo(messageKey: string, options?: ToastState) {
        this.show(messageKey, options.titleKey, MessageType.INFO, options)
    }
    showSuccess(messageKey?: string, options?: ToastState) {
        this.show(messageKey ?? 'SUCCESS', options.titleKey, MessageType.SUCCESS, options)
    }
    showWarning(messageKey: string, options?: ToastState) {
        this.show(messageKey, options.titleKey, MessageType.WARNING, options)
    }
}