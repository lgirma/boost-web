import {DialogOptions, MessageBoxServiceBase} from "./MessageBoxService";

export class AlertDialogService extends MessageBoxServiceBase {
    showMessage(message: string) {
        alert(message)
    }
    showConfirm(question?: string, options?: DialogOptions) {
        if (confirm(question))
            options?.onAccept?.()
        else
            options?.onCancel?.()
    }
    
}