import {MessageBoxService, MessageBoxState, MessageType, } from ".";
import {i18nService} from "../i18n";

export class WebAlertMessageBoxService implements MessageBoxService {

    showMessage(messageKey: string, _1?, _2?): MessageBoxState {
        globalThis.alert(this._i18n._(messageKey))
        return {} as MessageBoxState
    }
    showError(messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState {
        return this.showMessage(messageKey, MessageType.ERROR, options)
    }
    showInfo(messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState {
        return this.showMessage(messageKey, MessageType.INFO, options)
    }
    showSuccess(messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState {
        return this.showMessage(messageKey, MessageType.SUCCESS, options)
    }
    showWarning(messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState {
        return this.showMessage(messageKey, MessageType.WARNING, options)
    }

    constructor(private _i18n: i18nService) {}
}