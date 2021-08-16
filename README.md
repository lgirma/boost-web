# Boost Web

Web functionality abstractions.

`boost-web` is a js/ts library of abstract interfaces and classes for common web functionality.

## Installation

```shell
npm i boost-web
```

## Basic Usage

Use the `startup` method to initialize dependencies and `boot` to start your application.

**Startup.ts**:
```typescript
import appConfig from './appConfig.dev.json'
import i18n_res from './i18n.json'
import {startup, boot, SetupDefaultServices} from 'boost-web'
import MyHomePage from './MyHomePage.svelte'

startup({
    config: appConfig,
    i18nRes: i18n_res,
    setup: services => {
        SetupDefaultServices(services, appConfig)
    }
})

boot(MyHomePage)
```

Then to access any of the services use `globalThis.c` or simply `c`:

```typescript
const _http = globalThis.c('http')

// ... later:
let apiInfo = await _http.get('api/info')
```

## Provided Modules

| Module |  |
| ------------------------| -------|
| [app](https://github.com/lgirma/boost-web/tree/master/src/app) | Application startup and info |
| [config](https://github.com/lgirma/boost-web/tree/master/src/config) | Static application configuration |
| [events](https://github.com/lgirma/boost-web/tree/master/src/events) | publish and subscribe to events |
| [http](https://github.com/lgirma/boost-web/tree/master/src/events) | Http based Api calls |
| [i18n](https://github.com/lgirma/boost-web/tree/master/src/i18n) | Internationalization |
| [logging](https://github.com/lgirma/boost-web/tree/master/src/log) | Data logging |
| [routing](https://github.com/lgirma/boost-web/tree/master/src/routing) | Navigation and routing |
| [security](https://github.com/lgirma/boost-web/tree/master/src/security) | Authentication and role-based security |
| [session](https://github.com/lgirma/boost-web/tree/master/src/session) | Storage for user sessions |
| [ui](https://github.com/lgirma/boost-web/tree/master/src/ui) | User interfaces |

## More

To install more plugins, check out [boost-web-universe](https://github.com/lgirma/boost-web-universe) and [boost-web-universe-svelte](https://github.com/lgirma/boost-web-universe-svelte) packages.