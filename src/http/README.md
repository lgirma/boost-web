# http

Http based Api call utilities

Abstractions:

* `HttpService`
* `HttpServiceBase`
* `ApiErrorHandlerService`
  
Implementations:

* `FetchHttpService`
* `SimpleApiErrorHandlerService`

## Configuration

Use `http` key entry with the type `HttpConfig`

```javascript
{
    http: {
        apiBaseUrl: 'https://api.server.com'
    }
}
```

## Usage

Use `get`, `post` and `request` methods to call an http fetch

```typescript
class ContactService {
    private _http: HttpService

    async findContacts(name: string) {
        return await _http.post('contact/find', {name})
    }

    constructor(http: HttpService) {
        this._http = http
    }
}
```

Don't forget to wrap api calls with `try-catch` blocks