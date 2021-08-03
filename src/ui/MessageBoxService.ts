import {MessageType} from "./Common";
import {AppEvent} from "../events";

export interface MessageBoxState
{
    titleKey: string
    messageKey: string
    messageType: MessageType
    acceptButtonTitleKey: string,
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
    showMessage(prevState: MessageBoxState, messageKey: string, messageType?: MessageType, options?: Partial<MessageBoxState>): MessageBoxState
    showError(prevState: MessageBoxState, messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState
    showSuccess(prevState: MessageBoxState, messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState
    showWarning(prevState: MessageBoxState, messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState
    showInfo(prevState: MessageBoxState, messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState
}

export class MessageBoxStateService implements MessageBoxService {
    onOpen = new AppEvent<MessageBoxState>()

    showMessage(prevState: MessageBoxState, messageKey: string, messageType?: MessageType, options?: Partial<MessageBoxState>) {
        const result = {
            prevState,
            ...DefaultMessageBoxMessage,
            messageKey: messageKey ?? DefaultMessageBoxMessage.messageKey,
            messageType: messageType ?? DefaultMessageBoxMessage.messageType,
            ...options,
            isOpen: true
        }
        this.onOpen.publish(result)
        return result
    }

    showError(prevState: MessageBoxState, messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState {
        return this.showMessage(prevState, messageKey, MessageType.ERROR, options)
    }
    showInfo(prevState: MessageBoxState, messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState {
        return this.showMessage(prevState, messageKey, MessageType.INFO, options)
    }
    showSuccess(prevState: MessageBoxState, messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState {
        return this.showMessage(prevState, messageKey, MessageType.SUCCESS, options)
    }
    showWarning(prevState: MessageBoxState, messageKey: string, options?: Partial<MessageBoxState>): MessageBoxState {
        return this.showMessage(prevState, messageKey, MessageType.WARNING, options)
    }
}