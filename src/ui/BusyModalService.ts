export interface BusyModalState
{
    titleKey: string
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
    hide(prevState) {
        return {...DefaultBusyModalMessage, ...prevState, isOpen: false}
    }

    show(titleKey?: string, prevState?): BusyModalState {
        return {
            ...DefaultBusyModalMessage, ...prevState,
            titleKey: titleKey ?? DefaultBusyModalMessage.titleKey,
            isOpen: true
        }
    }

}