import {ConfigService} from "../config";
import {HttpService} from "../http";
import {AuthService, SecurityService} from "../security";
import {i18nService} from "../i18n";
import {LoggerService} from "../log";
import {NavigationService} from "../routing";
import {SessionStorageService} from "../session";
import {BusyBarService, MessageBoxService, ConfirmDialogService, BusyModalService, PageResourcesService, ToastService} from "../ui";
import {AppService} from "../app";
import {StringUtils} from "../common";

export type ContainerServices = {
    app: AppService
    config: ConfigService
    i18n: i18nService
    log: LoggerService
    nav: NavigationService
    session: SessionStorageService
    security: SecurityService
    auth: AuthService
    http: HttpService
    'busy-bar': BusyBarService
    'string-utils': StringUtils
    'page-resources': PageResourcesService
    toast: ToastService
    'message-box': MessageBoxService
    'confirm-dialog': ConfirmDialogService
    'busy-modal': BusyModalService
    [others: string]: any
}

export type ContainerType = <K extends keyof ContainerServices>(name: K) => ContainerServices[K]