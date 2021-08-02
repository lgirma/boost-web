import {ModalDialogService, ModalRef} from "./ModalDialogService";
import {HtmlTemplateService} from "./HtmlTemplateService";
import {IconService} from "./IconService";
import {i18nService} from "../i18n";
import {Messagei18nKeys, MessageType} from "./Common";
import {DialogOptions, MessageBoxServiceBase} from "./MessageBoxService";

const ID = 'modal-msg-box'

/**
 * MessageBoxService implementation that uses ModalDialogService
 */
export class ModalMessageBoxService extends MessageBoxServiceBase {
    protected _modalService: ModalDialogService
    protected _html: HtmlTemplateService
    protected _ico: IconService
    protected _msgModal: ModalRef
    protected _confirmModal: ModalRef
    protected _i18n: i18nService

    showConfirm(question?: string, options?: DialogOptions) {
        options = {
            acceptButtonTitle: 'YES',
            cancelButtonTitle: 'NO',
            isBodyHtml: true,
            title: 'CONFIRM',
            ...options
        }
        this._modalService.update(this._confirmModal, {
            header: options.title,
            body: question,
            hideCloseButton: false
        })
        this._modalService.show(this._confirmModal)
    }

    showMessage(message: string, messageType?: MessageType, options?: DialogOptions) {
        messageType ??= MessageType.NONE
        options = {
            acceptButtonTitle: 'OK',
            isBodyHtml: true,
            title: this._i18n._(Messagei18nKeys[messageType]),
            body: '',
            ...options
        }
        this._modalService.update(this._msgModal, {
            header: options.title,
            body: message,
            hideCloseButton: false
        })
        this._modalService.show(this._msgModal)
    }

    constructor(modalService: ModalDialogService, htmlService: HtmlTemplateService, iconService: IconService,
                i18n: i18nService) {
        super();
        this._modalService = modalService
        this._html = htmlService
        this._ico = iconService
        this._i18n = i18n
        this._msgModal = modalService.getModal(`${ID}-message`)
        this._confirmModal = modalService.getModal(`${ID}-confirm`)
    }
}