# security

Abstractions:

* `AuthService`
* `SecurityService`

Implementations:

* `SimpleAuthService`
* `JWTAuthService`
* `SimpleSecurityService`

## Configuration

Use `security` and `auth` keys to configure both modules

```javascript
{
    auth: {
        LoginApiUrl: 'auth/login',
        UserIdFieldName: 'email',
        PasswordFieldName: 'secret'
    },
    security: {
        Roles: {ADMIN: 'Admin', GUEST: 'Guest', SUPERUSER: 'Super User'},
        AuthPageUrl: '/login',
        LogoutUrl: '/logout',
        UnauthorizedPageUrl: '/400',
        BundleRoles: {a: 'ADMIN', g: 'GUEST', s: 'SUPERUSER'},
        RoleBundles: {ADMIN: 'a', GUEST: 'g', SUPERUSER: 's'}
    }
}
```

## Usage

### AuthService

To login:

```javascript
const user = await _auth.login({
    userId: 'admin', 
    password: 'admin'
}))

console.log('Logged in user', user.getFullName())
```

To logout:

```javascript
_auth.logout()
```

## Security Service