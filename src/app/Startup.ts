import {
    Container,
    ContainerBuilder,
    i18nResource,
    StaticConfig
} from "..";

let containerBuilder: ContainerBuilder<any>

export interface StartupProps {
    config?: Partial<StaticConfig>
    i18nRes?: i18nResource
    setup?: (services: ContainerBuilder<any>) => void
}

export function startup({config, setup}: StartupProps = {}) {
    config = {...config}
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