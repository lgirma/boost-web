import {MessageType, ScreenPosition} from "./Common";
import {AppEvent} from "../events";

export interface ToastState {
    isOpen: boolean
    type?: MessageType
    autoHide?: boolean
    timeout?: number
    titleKey?: string
    detailKey?: string
    isDetailHtml?: boolean
    position?: ScreenPosition
}

const DefaultToastState: ToastState = {
    autoHide: true,
    detailKey: 'INFORMATION',
    isDetailHtml: false,
    isOpen: false,
    position: ScreenPosition.TOP_LEFT,
    timeout: 10000,
    titleKey: '',
    type: MessageType.INFO
}

export interface ToastService {
    show(detailKey: string, titleKey: string, type: MessageType, options?: ToastState)
    hide()
    showSuccess(messageKey: string, options?: ToastState)
    showError(messageKey: string, options?: ToastState)
    showInfo(messageKey: string, options?: ToastState)
    showWarning(messageKey: string, options?: ToastState)
}

export class ToastStateService implements ToastService {
    onToggle = new AppEvent<ToastState>()

    show(detailKey: string, titleKey: string, type: MessageType, options?: ToastState): ToastState {
        this.hide()
        const result = {
            ...DefaultToastState,
            ...options,
            detailKey,
            titleKey,
            type,
            isOpen: true
        }
        this.onToggle.publish(result)
        return result
    }

    hide() {
        const result = {...DefaultToastState, isOpen: false}
        this.onToggle.publish(result)
        return result
    }

    showSuccess(messageKey: string, options?: ToastState): ToastState {
        return this.show(messageKey, 'SUCCESS', MessageType.SUCCESS, options);
    }

    showError(messageKey: string, options?: ToastState): ToastState {
        return this.show(messageKey, 'FAILED', MessageType.ERROR, options);
    }

    showInfo(messageKey: string, options?: ToastState): ToastState {
        return this.show(messageKey, 'INFORMATION', MessageType.INFO, options);
    }

    showWarning(messageKey: string, options?: ToastState): ToastState {
        return this.show(messageKey, 'WARNING', MessageType.WARNING, options);
    }
}