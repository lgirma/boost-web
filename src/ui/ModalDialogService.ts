import {Size} from "./Common";

export interface ModalOptions {
    header?: any
    content?: any
    footer?: any
    size?: Size
    hideCloseButton?: boolean
}

export type ModalInstance = any

export interface ModalDialogService {
    createModal(options?: ModalOptions, modalInstance?: ModalInstance): ModalInstance
    showModal(modal: ModalInstance, options?: ModalOptions)
    hideModal(modal: ModalInstance, options?: ModalOptions)
}