import {MessageMap, MessageType, Size} from "./Common";
import {ModalDialogService, ModalInstance} from "./ModalDialogService";
import {HtmlService} from "./HtmlService";
import {IconService} from "./IconService";
import {ButtonService} from "./ButtonService";
import {i18nService} from "../i18n";

export interface DialogOptions {
    title?: string
    body?: string
    isBodyHtml?: boolean
    acceptButtonTitle?: string
    cancelButtonTitle?: string
    onAccept: () => void
    onCancel: () => void
    hideCancelButton?: boolean
    dontCloseOnAccept?: boolean
}

export interface DialogService {
    showMessage(message: string, messageType?: MessageType, options?: DialogOptions)
    showConfirm(question?: string, options?: DialogOptions)
    showError(message: string, options?: DialogOptions)
    showSuccess(message: string, options?: DialogOptions)
    showWarning(message: string, options?: DialogOptions)
    showInfo(message: string, options?: DialogOptions)
    showConfirmAsync(question?: string, options?: DialogOptions): Promise<boolean>
    init()
}

export abstract class DialogServiceBase implements DialogService {
    init() {}
    abstract showMessage(message: string, messageType?: MessageType, options?: DialogOptions)
    abstract showConfirm(question?: string, options?: DialogOptions)
    showError(message: string, options?: DialogOptions) {
        this.showMessage(message, MessageType.ERROR, options)
    }
    showSuccess(message: string, options?: DialogOptions) {
        this.showMessage(message, MessageType.SUCCESS, options)
    }
    showWarning(message: string, options?: DialogOptions) {
        this.showMessage(message, MessageType.WARNING, options)
    }
    showInfo(message: string, options?: DialogOptions) {
        this.showMessage(message, MessageType.INFO, options)
    }
    async showConfirmAsync(question?: string, options?: DialogOptions) : Promise<boolean> {
        return new Promise(
            (resolve) => this.showConfirm(question,{
                ...options,
                onAccept: () => resolve(true),
                onCancel: () => resolve(false)
            })
        );
    }
}

export class ModalBasedDialogService extends DialogServiceBase {
    protected _modalService: ModalDialogService
    protected _html: HtmlService
    protected _iconService: IconService
    protected _buttonService: ButtonService
    protected _modal: ModalInstance
    protected _i18n: i18nService

    showConfirm(question?: string, options?: DialogOptions) {
        if (this._modal == null)
            this._modal = this._modalService.createModal()
        options = {
            acceptButtonTitle: 'YES',
            cancelButtonTitle: 'NO',
            isBodyHtml: true,
            title: 'CONFIRM',
            ...options
        }
        const messageType = MessageType.WARNING
        this._modalService.showModal(this._modal, {
            header: options.title,
            content: this._html.render('div', `${this._iconService.icoForMsg(messageType)} ${this._i18n._('CONFIRM')}`, {message: messageType, size: Size.LG}) +
                this._html.render('div', question),
            footer: this._buttonService.render(this._i18n._(options.cancelButtonTitle), {onclick: _ => {
                        this._modalService.hideModal(this._modal)
                        if (options.onCancel) options.onCancel()
                    }}) + ' ' +
                this._buttonService.render(this._i18n._(options.acceptButtonTitle), {onclick: _ => {
                        this._modalService.hideModal(this._modal)
                        if (options.onAccept) options.onAccept()
                    }}),
            size: Size.MD,
            hideCloseButton: true
        })
    }

    showMessage(message: string, messageType?: MessageType, options?: DialogOptions) {
        if (this._modal == null)
            this._modal = this._modalService.createModal()
        messageType ??= MessageType.NONE
        options = {
            acceptButtonTitle: 'OK',
            isBodyHtml: true,
            ...options
        }
        this._modalService.showModal(this._modal, {
            header: options.title,
            content: this._html.render('div', `${this._iconService.icoForMsg(messageType)} ${this._i18n._(MessageMap[messageType])}`, {message: messageType, size: Size.LG}) +
                this._html.render('div', message),
            footer: this._buttonService.render(
                this._i18n._(options.acceptButtonTitle),
                {onclick: _ => this._modalService.hideModal(this._modal)}),
            size: Size.MD,
            hideCloseButton: true
        })
    }

    constructor(modalService: ModalDialogService, htmlService: HtmlService, iconService: IconService, buttonService: ButtonService, i18n: i18nService) {
        super();
        this._modalService = modalService
        this._html = htmlService
        this._iconService = iconService
        this._buttonService = buttonService
        this._i18n = i18n
    }
}