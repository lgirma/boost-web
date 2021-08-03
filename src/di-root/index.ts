import {ConfigService} from "../config";
import {HttpService} from "../http";
import {AuthService, SecurityService} from "../security";
import {i18nService} from "../i18n";
import {LoggerService} from "../log";
import {NavigationService} from "../routing";
import {SessionStorageService} from "../session";
import {BusyBarService, ModalDialogService, PageResourcesService, ToastService} from "../ui";
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
    modal: ModalDialogService
    [others: string]: any
}

export type ContainerType = <K extends keyof ContainerServices>(name: K) => ContainerServices[K]

/*
const container = Container()
    .add("config", () => (null as ConfigService))
    .add("i18n", () => (null as i18nService))
    .add("log", () => (null as LoggerService))
    .add("nav", () => (null as NavigationService))
    .add("session", () => (null as SessionStorageService))
    .add("security", () => (null as SecurityService))
    .add("auth", () => (null as AuthService))
    .add("http", () => (null as HttpService))
    .add("busy-bar", () => (null as BusyBarService))
    .finish();

export default container;*/
