import { ConfigService } from "../config"

export type i18nTranslations = {[key: string]: string}
/**
 * Represents a translation resource
 * A typical translation resource could look like:
 *
 * @example
 * {
 *     "en": {
 *         "OK": "Ok",
 *         "CANCEL": "Cancel"
 *     },
 *     "am": {
 *         "OK": "እሺ",
 *         "CANCEL": "ተወው"
 *     }
 * }
 */
export type i18nResource = {[langKey: string]: i18nTranslations}

export interface WebLocale {
    displayName: string
    shortName: string
    key: string
}

export interface i18nConfig {
    /**
     * Default value is 'en'
     */
     DefaultLocale?: string
     /**
      * Locales your app supports
      * Default is `[ {displayName: 'English', key: 'en', shortName: 'En'} ]`
      */
     Locales?: WebLocale[],
     Translations?: i18nResource
}

export interface i18nService {
    getCurrentUserLanguage(): string;
    changeLanguage(lang: string);
    _(key: string, ...args): string
    addTranslations(res: i18nResource)
}

export class Simplei18nService implements i18nService {
    _dictionary = {}
    _currentLang: string
    _config: i18nConfig

    _(key: string, ...args): string {
        const currLang = this._currentLang ?? this.getCurrentUserLanguage();
        let result = this._config.Translations[currLang][key];
        if (result === undefined && currLang != this._config.DefaultLocale)
            result = this._config.Translations[this._config.DefaultLocale][key];
        for (let i=0; i<args.length; i++) {
            result = result.replace(`{${i}}`, args[i]);
        }
        return result ?? key;
    }

    changeLanguage(lang: string) {
        localStorage.setItem('userLanguage', lang);
        this._currentLang = lang;
    }

    getCurrentUserLanguage(): string {
        return this._currentLang
            ?? (this._currentLang = localStorage.getItem('userLanguage') || this._config.DefaultLocale || 'en');
    }

    addTranslations(res: i18nResource) {
        const langKeys = Object.keys(res);
        for (let i=0; i<langKeys.length; i++) {
            const langKey = langKeys[i];
            let translations = this._config.Translations[langKey];
            if (translations == null)
                translations = this._config.Translations[langKey] = {};
            Object.keys(res[langKey]).forEach(tKey => {
                translations[tKey] = res[langKey][tKey];
            });
        }
    }

    constructor(configService: ConfigService) {
        this._config = configService.get('i18n', {
            DefaultLocale: 'en',
            Locales: [
                {displayName: 'English', key: 'en', shortName: 'En'}
            ],
            Translations: {}
        })
    }
}