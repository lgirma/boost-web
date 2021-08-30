import {PartialFormConfig} from "./FormModels";
import {AppEvent} from "../events";
import {MessageType} from "./Common";

export interface ModalFormState {
    titleKey?: string
    messageType?: MessageType
    acceptButtonTitleKey?: string
    declineButtonTitleKey?: string
    acceptButtonProps?: any,
    onAccept?: (formData: any) => any,
    onDecline?: () => void,
    isOpen: boolean
    forObj: any
    formConfig?: PartialFormConfig
}

export interface ModalFormService {
    showAsync<T = any>(forObj: T, formConfig?: PartialFormConfig, options?: Partial<ModalFormState>): Promise<T | null>
}

const DefaultModalFormState: ModalFormState = {
    titleKey: 'EDIT',
    messageType: MessageType.WARNING,
    acceptButtonTitleKey: 'SUBMIT',
    declineButtonTitleKey: 'CANCEL',
    acceptButtonProps: {},
    onAccept: _ => {},
    isOpen: false,
    forObj: {},
    formConfig: null
}

export class ModalFormStateService implements ModalFormService{
    onToggle = new AppEvent<ModalFormState>()

    show(forObj: any, formConfig: PartialFormConfig, options?: Partial<ModalFormState>): ModalFormState {
        let result = {
            ...DefaultModalFormState,
            ...options,
            forObj,
            formConfig,
            isOpen: true
        };
        this.onToggle.publish(result)
        return  result
    }

    showAsync<T = any>(forObj: T, formConfig: PartialFormConfig, options?: Partial<ModalFormState>): Promise<T | null> {
        return new Promise(
            (resolve) => this.show(forObj, formConfig, {
                ...options,
                onAccept: (formData: any) => resolve(formData),
                onDecline: () => resolve(null)
            })
        );
    }
}