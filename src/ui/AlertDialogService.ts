import { DialogOptions, DialogService } from "./DialogService";

export class AlertDialogService extends DialogService {
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