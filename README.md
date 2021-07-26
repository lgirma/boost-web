# Boost Web

Web functionality abstractions.

`boost-web` is a js/ts library of abstract interfaces and classes for common web functionality.

## Installation

```shell
npm i boost-web
```

## Usage

Implement any interface using your favorite dependency injection.

For example, manually setting up modules `config`, `app` and `http`:

**Container.ts**:
```typescript
import appConfig from './appConfig.dev.json'

const _config: ConfigService = new SimpleConfigService(appConfig)
const _app: AppService = new SimpleAppService(_config)
const _http: HttpService = new FetchHttpService(_config)
```

Then using the `http` service:

```typescript
import {_http} from '/Container'

let apiInfo = await _http.get<ApiInfo>('api/info')
```

## Provided Modules

| Module |  |
| ------------------------| -------|
| [app](https://github.com/lgirma/boost-web/tree/master/src/app) | Application info |
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

To install more plugins, check out [boost-web-universe](https://github.com/lgirma/boost-web-universe) package.