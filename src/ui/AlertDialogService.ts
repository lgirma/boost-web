import {DialogOptions, DialogServiceBase} from "./DialogService";

export class AlertDialogService extends DialogServiceBase {
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