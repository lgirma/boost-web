import {Size} from "./Common";

export interface ModalOptions {
    header?: any
    body?: any
    footer?: any
    size?: Size
    hideCloseButton?: boolean
    id?: string
}

export type ModalRef = any
export interface ModalInstance {
    ref: ModalRef
    html?: string
}

export interface ModalDialogService {
    getModal(id: any): ModalRef
    update(modal: ModalRef, options?: ModalOptions): ModalInstance
    show(modal: ModalRef)
    hide(modal: ModalRef)
}