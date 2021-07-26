import {ModalDialogService, ModalInstance} from "./ModalDialogService";
import {HtmlTemplateService} from "./HtmlTemplateService";
import {IconService} from "./IconService";
import {ButtonService} from "./ButtonService";
import {i18nService} from "../i18n";
import {Messagei18nKeys, MessageType, Size} from "./Common";
import {DialogOptions, DialogServiceBase} from "./DialogService";


export class ModalBasedDialogService extends DialogServiceBase {
    protected _modalService: ModalDialogService
    protected _html: HtmlTemplateService
    protected _ico: IconService
    protected _btn: ButtonService
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
            content: this._html.render('div', `${this._ico.icoForMsg(messageType)} ${this._i18n._('CONFIRM')}`, {message: messageType, size: Size.LG}) +
                this._html.render('div', question),
            footer: this._btn.render(this._i18n._(options.cancelButtonTitle), {onclick: _ => {
                        this._modalService.hideModal(this._modal)
                        if (options.onCancel) options.onCancel()
                    }}) + ' ' +
                this._btn.render(this._i18n._(options.acceptButtonTitle), {onclick: _ => {
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
            content: this._html.render('div', `${this._ico.icoForMsg(messageType)} ${this._i18n._(Messagei18nKeys[messageType])}`, {message: messageType, size: Size.LG}) +
                this._html.render('div', message),
            footer: this._btn.render(
                this._i18n._(options.acceptButtonTitle),
                {onclick: _ => this._modalService.hideModal(this._modal)}),
            size: Size.MD,
            hideCloseButton: true
        })
    }

    constructor(modalService: ModalDialogService, htmlService: HtmlTemplateService, iconService: IconService, buttonService: ButtonService, i18n: i18nService) {
        super();
        this._modalService = modalService
        this._html = htmlService
        this._ico = iconService
        this._btn = buttonService
        this._i18n = i18n
    }
}