import {
    Container,
    ContainerBuilder, deepMerge,
    i18nResource, SecurityConfig,
    StaticConfig, User
} from "..";

let containerBuilder: ContainerBuilder<any>

export interface StartupProps {
    config?: Partial<StaticConfig>
    i18nRes?: i18nResource
    setup?: (services: ContainerBuilder<any>) => void
}

export function startup({config, setup, i18nRes}: StartupProps = {}) {
    config = {...config}
    config.i18n = {...config.i18n}
    config.i18n.translations = deepMerge(config.i18n.translations, i18nRes)
    if (globalThis.window)
        globalThis.window.document.title = config.app.title
    containerBuilder = Container()

    if (setup)
        setup(containerBuilder)
}

export function boot(startPage: any, isSecure = true) {
    if (containerBuilder == null)
        startup()
    const c = globalThis.c = containerBuilder.finish()
    if (isSecure) {
        if (c('security').init(isSecure))
            c('app').start(startPage)
    } else {
        c('app').start(startPage)
    }
}

export function preStart(securityConfig: SecurityConfig) {
    let user = JSON.parse(localStorage.getItem('user')) as User
    if (user == null)
        window.location.href = securityConfig.AuthBundle
    else
        window.location.href = securityConfig.RoleBundles[user.primaryRole]
}