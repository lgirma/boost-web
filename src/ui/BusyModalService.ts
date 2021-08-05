import {AppEvent} from "../events";

export interface BusyModalState
{
    titleKey?: string
    isOpen: boolean
}

const DefaultBusyModalMessage: BusyModalState = {
    titleKey: 'PLEASE_WAIT',
    isOpen: false
}

export interface BusyModalService {
    show(titleKey?: string, prevState?: BusyModalState): BusyModalState
    hide(prevState?: BusyModalState): BusyModalState
}

export class BusyModalStateService implements BusyModalService {
    onToggle = new AppEvent<BusyModalState>()

    hide(prevState?) {
        const result = {...DefaultBusyModalMessage, ...prevState, isOpen: false}
        this.onToggle.publish(result)
        return result
    }

    show(titleKey?: string, prevState?): BusyModalState {
        const result = {
            ...DefaultBusyModalMessage,
            ...prevState,
            titleKey: titleKey ?? DefaultBusyModalMessage.titleKey,
            isOpen: true
        }
        this.onToggle.publish(result)
        return result
    }

}