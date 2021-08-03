import {MessageType} from ".";
import {AppEvent} from "../events";
import {i18nService} from "../i18n";
import {StringUtils} from "../common";

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
    show(questionKey?: string, detailKey?: string, options?: Partial<ConfirmDialogState>): ConfirmDialogState
    showAsync(questionKey?: string, detailKey?: string, options?: Partial<ConfirmDialogState>): Promise<boolean>
}

export class ConfirmDialogStateService implements ConfirmDialogService {
    onToggle = new AppEvent<ConfirmDialogState>()

    show(questionKey?: string, detailKey?: string, options?: Partial<ConfirmDialogState>): ConfirmDialogState {
        let result = {
            ...DefaultConfirmDialogState,
            questionKey: questionKey ?? DefaultConfirmDialogState.questionKey,
            detailKey: detailKey ?? DefaultConfirmDialogState.detailKey,
            ...options,
            isOpen: true
        };
        this.onToggle.publish(result)
        return  result
    }

    showAsync(questionKey?: string, detailKey?: string, options?: Partial<ConfirmDialogState>): Promise<boolean> {
        return new Promise(
            (resolve) => this.show(questionKey, detailKey, {
                ...options,
                onAccept: () => resolve(true),
                onDecline: () => resolve(false)
            })
        );
    }

}

export class WebConfirmDialogService implements ConfirmDialogService {
    show(questionKey?: string, detailKey?: string, options?: Partial<ConfirmDialogState>): ConfirmDialogState {
        const result = globalThis.confirm(this._i18n._(questionKey) + (this._str.isEmpty(detailKey) ? '' : `\n${this._i18n._(detailKey)}`))
        if (result)
            options.onAccept()
        else options.onDecline()
        return {...DefaultConfirmDialogState, ...options, questionKey, detailKey, isOpen: true}
    }

    showAsync(questionKey?: string, detailKey?: string, _1?: Partial<ConfirmDialogState>): Promise<boolean> {
        return new Promise(
            (resolve) => this.show(questionKey, detailKey, {
                ..._1,
                onAccept: () => resolve(true),
                onDecline: () => resolve(false)
            })
        );
    }

    constructor(private _i18n: i18nService, private _str: StringUtils) {}

}