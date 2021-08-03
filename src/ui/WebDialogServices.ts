import {MessageBoxService, MessageBoxState, MessageType, } from ".";
import {ConfirmDialogService, ConfirmDialogState} from "./ConfirmDialogService";
import {i18nService} from "../i18n";
import {StringUtils} from "../common";

export class WebAlertMessageBoxService implements MessageBoxService {

    showMessage(_, messageKey: string, _1?, _2?): MessageBoxState {
        globalThis.alert(this._i18n._(messageKey))
        return {..._}
    }
    showError(_, messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState {
        return this.showMessage(_, messageKey, MessageType.ERROR, options)
    }
    showInfo(_, messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState {
        return this.showMessage(_, messageKey, MessageType.INFO, options)
    }
    showSuccess(_, messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState {
        return this.showMessage(_, messageKey, MessageType.SUCCESS, options)
    }
    showWarning(_, messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState {
        return this.showMessage(_, messageKey, MessageType.WARNING, options)
    }

    constructor(private _i18n: i18nService) {
    }
    
}

export class WebConfirmDialogService implements ConfirmDialogService {
    showConfirm(_: ConfirmDialogState, questionKey?: string, detailKey?: string, options?: Partial<ConfirmDialogState>): ConfirmDialogState {
        const result = globalThis.confirm(this._i18n._(questionKey) + (this._str.isEmpty(detailKey) ? '' : `\n${this._i18n._(detailKey)}`))
        if (result)
            options.onAccept()
        else options.onDecline()
        return {..._}
    }

    showConfirmAsync(_: ConfirmDialogState, questionKey?: string, detailKey?: string, _1?: Partial<ConfirmDialogState>): Promise<boolean> {
        return new Promise(
            (resolve) => this.showConfirm(_, questionKey, detailKey, {
                ..._1,
                onAccept: () => resolve(true),
                onDecline: () => resolve(false)
            })
        );
    }

    constructor(private _i18n: i18nService, private _str: StringUtils) {}

}