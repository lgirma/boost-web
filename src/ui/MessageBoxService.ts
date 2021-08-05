import {MessageType} from "./Common";
import {AppEvent} from "../events";

export interface MessageBoxState
{
    titleKey?: string
    messageKey?: string
    messageType?: MessageType
    acceptButtonTitleKey?: string,
    isOpen: boolean
}

const DefaultMessageBoxMessage: MessageBoxState = {
    titleKey: '',
    messageKey: 'INFORMATION',
    messageType: MessageType.INFO,
    acceptButtonTitleKey: 'OK',
    isOpen: false
}

export interface MessageBoxService {
    showMessage(messageKey: string, messageType?: MessageType, options?: Partial<MessageBoxState>): MessageBoxState
    showError(messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState
    showSuccess(messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState
    showWarning(messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState
    showInfo(messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState
}

export class MessageBoxStateService implements MessageBoxService {
    onToggle = new AppEvent<MessageBoxState>()

    showMessage(messageKey: string, messageType?: MessageType, options?: Partial<MessageBoxState>) {
        const result = {
            ...DefaultMessageBoxMessage,
            messageKey: messageKey ?? DefaultMessageBoxMessage.messageKey,
            messageType: messageType ?? DefaultMessageBoxMessage.messageType,
            ...options,
            isOpen: true
        }
        this.onToggle.publish(result)
        return result
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
}