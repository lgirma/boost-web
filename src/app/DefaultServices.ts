import {
    BusyModalStateService,
    ConfirmDialogStateService, ContainerBuilder,
    DefaultStringUtils,
    FetchHttpService, JWTAuthService,
    LocalSessionStorageService, MessageBoxStateService, SimpleApiErrorHandlerService,
    SvelteAppService,
    SimpleConfigService, Simplei18nService, SimpleSecurityService, StaticConfig, WebPageResourcesService,
    WindowNavigationService,
    ToastStateService, SimpleFormService, DataTableStateService, LookupServiceImpl, CrudServiceImpl
} from "..";

export function SetupDefaultServices(services: ContainerBuilder<any>, config?: Partial<StaticConfig>) {
services.add('config', () => new SimpleConfigService(config))
    .add('app', c => new SvelteAppService(c('config')))
    .add('nav', () => new WindowNavigationService())
    .add('http', c => new FetchHttpService(c('config')))
    .add('session', () => new LocalSessionStorageService())
    .add('i18n', c => new Simplei18nService(c('config'), c('session')))
    .add('page-resources', () => new WebPageResourcesService())
    .add('security', c => new SimpleSecurityService(c('config'), c('session'), c('nav')))
    .add('auth', c => new JWTAuthService(c('config'), c('security'), c('http'), c('nav')), false)
    .add('string-utils', c => new DefaultStringUtils(c('i18n')))
    .add('message-box', () => new MessageBoxStateService())
    .add('confirm-dialog', () => new ConfirmDialogStateService())
    .add('busy-modal', () => new BusyModalStateService())
    .add('toast', () => new ToastStateService())
    .add('form', c => new SimpleFormService(c('string-utils')))
    .add('api-error', c => new SimpleApiErrorHandlerService(c('config'), c('toast')))
    .add('data-table', c => new DataTableStateService(c('form'), c('string-utils'), c('config')))
    .add('lookup', c => new LookupServiceImpl(c('config')))
    .add('crud', c => new CrudServiceImpl(c('config'), c('string-utils')))
}