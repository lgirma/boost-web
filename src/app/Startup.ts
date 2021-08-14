import {
    Container,
    ContainerBuilder, deepMerge,
    i18nResource,
    StaticConfig
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

export function boot() {
    if (containerBuilder == null)
        startup()
    globalThis.c = containerBuilder.finish()
}