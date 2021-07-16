import { MessageType } from "./Common";

export interface DialogOptions {
    title?: string
    body?: string
    isBodyHtml?: boolean
    acceptButtonTitle?: string
    cancelButtonTitle?: string
    onAccept: () => void
    onCancel: () => void
    hideCancelButton?: boolean
    dontCloseOnAccept?: boolean
}

export abstract class DialogService {
    abstract showMessage(message: string, messageType?: MessageType, options?: DialogOptions)
    abstract showConfirm(question?: string, options?: DialogOptions)
    showError(message: string, options?: DialogOptions) {
        this.showMessage(message, MessageType.ERROR, options)
    }
    showSuccess(message: string, options?: DialogOptions) {
        this.showMessage(message, MessageType.SUCCESS, options)
    }
    showWarning(message: string, options?: DialogOptions) {
        this.showMessage(message, MessageType.WARNING, options)
    }
    showInfo(message: string, options?: DialogOptions) {
        this.showMessage(message, MessageType.INFO, options)
    }
    async showConfirmAsync(question?: string, options?: DialogOptions) : Promise<boolean> {
        return new Promise(
            (resolve) => this.showConfirm(question,{
                ...options,
                onAccept: () => resolve(true),
                onCancel: () => resolve(false)
            })
        );
    }
}