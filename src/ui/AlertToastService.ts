import { i18nService } from "../i18n";
import { ToastMessage, ToastService } from "./ToastService";

export class AlertToastService extends ToastService {
    show(options?: ToastMessage) {
        alert(`${options.title}\n${options.body}`)
    }
    hide() { }

    constructor(i18n: i18nService) {
        super(i18n)
    }
}