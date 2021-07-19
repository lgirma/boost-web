# config

Application static configuration services

Abstractions:

* `ConfigService`

Implementations:

* `SimpleConfigService`

## Usage

Use `configFor` and initial configuration object to initialize.

```javascript
import {configFor, SimpleConfigService, HttpConfig} from 'boost-web'

new SimpleConfigService({
    http: configFor<HttpConfig>({
        ApiBaseUrl: 'https://api.application.com',
        Timeout: 2
    }),
    security: configFor<SecurityConfig>({
        Roles: ['ADMIN', 'GUEST']
    })
})
```

To read configuration values

```javascript
interface MyServiceConfig {
    Timeout?: number
    IsSecure?: boolean
}

class MyService {
    private MyServiceConfig _config

    constructor(config: ConfigService) {
        this._config = config.get<MyServiceConfig>('my-service', {
            Timeout: 1,
            IsSecure: true
        })
    }
}
```

This example assumes your config file could look like:

```javascript
{
    "my-service": {
        Timeout: 5,
        IsSecure: false
    }
}
```