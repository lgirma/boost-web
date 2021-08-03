import {MessageType} from ".";
import {AppEvent} from "../events";

export interface ConfirmDialogState
{
    titleKey: string
    questionKey: string
    messageType: MessageType
    detailKey: string
    acceptButtonTitleKey: string
    declineButtonTitleKey: string
    acceptButtonProps: any,
    onAccept: () => void,
    onDecline?: () => void,
    isOpen: boolean
}

const DefaultConfirmDialogState: ConfirmDialogState = {
    titleKey: 'CONFIRM',
    questionKey: 'ARE_YOU_SURE',
    messageType: MessageType.WARNING,
    detailKey: '',
    acceptButtonTitleKey: 'YES',
    declineButtonTitleKey: 'NO',
    acceptButtonProps: {},
    onAccept: () => {},
    isOpen: false
}

export interface ConfirmDialogService {
    showConfirm(prevState: ConfirmDialogState, questionKey?: string, detailKey?: string, options?: Partial<ConfirmDialogState>): ConfirmDialogState
    showConfirmAsync(prevState: ConfirmDialogState, questionKey?: string, detailKey?: string, options?: Partial<ConfirmDialogState>): Promise<boolean>
}

export class ConfirmDialogStateService implements ConfirmDialogService {
    onOpen = new AppEvent<ConfirmDialogState>()

    showConfirm(prevState: ConfirmDialogState, questionKey?: string, detailKey?: string, options?: Partial<ConfirmDialogState>): ConfirmDialogState {
        return {
            ...prevState,
            ...DefaultConfirmDialogState,
            questionKey: questionKey ?? DefaultConfirmDialogState.questionKey,
            detailKey: detailKey ?? DefaultConfirmDialogState.detailKey,
            ...options,
            isOpen: true
        }
    }

    showConfirmAsync(prevState: ConfirmDialogState, questionKey?: string, detailKey?: string, options?: Partial<ConfirmDialogState>): Promise<boolean> {
        return new Promise(
            (resolve) => this.showConfirm(prevState, questionKey, detailKey, {
                ...options,
                onAccept: () => resolve(true),
                onDecline: () => resolve(false)
            })
        );
    }

}