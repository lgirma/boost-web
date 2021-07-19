# i18n

Internationalization

Abstractions:

* `i18nService`

Implementations:

* `Simplei18nService`

## Configuration

Use the `i18n` key of type `i18nConfig`. 

Sample configuration:

```javascript
{
    i18n: {
        defaultLocale: 'en',
        locales: [
            {displayName: 'US English', key: 'en', shortName: 'En'},
            {displayName: 'GB English', key: 'en-GB', shortName: 'En GB'}
        ],
        translations: {
            en: {
                COLOR: 'Color',
                MOVE_TRASH: 'Move {0} items to trash can.'
            },
            'en-GB': {
                COLOR: 'Colour',
                MOVE_TRASH: 'Move {0} items to dust bin.'
            }
        }
    }
}
```

## Usage

Use the `_` method to get translated string

```typescript
class ContactService {
    private _18n: i18nService

    function pick() {
        console.log(this._i18n._('COLOR'), '#FFF')
    }

    constructor(i18n: i18nService) {
        this._i18n = i18n
    }
}
```

Can also be used with parameters as

```typescript
function confirmTrash(count) {
    confirm(this._i18n._('MOVE_TRASH', count))
}
```

To change or read the current language:

```typescript
this._i18n.changeLanguage('en-GB')

console.log(this._i18n.getCurrentUserLanguage())
```

To dynamically add translations use `addTranslations`

```typescript
this._i18n.addTranslations({
    "am-ET": {
        "OK": "እሺ",
        "CANCEL": "ተወው"
    }
})
```