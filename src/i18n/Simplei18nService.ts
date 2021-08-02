import {SessionStorageService} from "../session";
import {ConfigService} from "../config";
import {i18nConfig, i18nResource, i18nService} from "./i18nService";

export class Simplei18nService implements i18nService {
    _dictionary = {}
    _currentLang: string
    _config: i18nConfig
    _sessionStorage: SessionStorageService

    _(key: string, ...args): string {
        const currLang = this._currentLang ?? this.getCurrentUserLanguage();
        let resource = this._config.translations[currLang]
        if (resource == null)
            return key
        let result = resource[key];
        if (result === undefined && currLang != this._config.defaultLocale)
            result = this._config.translations[this._config.defaultLocale][key];
        for (let i=0; i<args.length; i++) {
            result = result.replace(`{${i}}`, args[i]);
        }
        return result ?? key;
    }

    changeLanguage(lang: string) {
        this._sessionStorage.setItem('userLanguage', lang);
        this._currentLang = lang;
    }

    getCurrentUserLanguage(): string {
        return this._currentLang
            ?? (this._currentLang = this._sessionStorage.getItem('userLanguage') || this._config.defaultLocale || 'en');
    }

    addTranslations(res: i18nResource) {
        const langKeys = Object.keys(res);
        for (let i=0; i<langKeys.length; i++) {
            const langKey = langKeys[i];
            let translations = this._config.translations[langKey];
            if (translations == null)
                translations = this._config.translations[langKey] = {};
            Object.keys(res[langKey]).forEach(tKey => {
                translations[tKey] = res[langKey][tKey];
            });
        }
    }

    constructor(configService: ConfigService, sessionStorage: SessionStorageService) {
        this._config = configService.get('i18n', {
            defaultLocale: 'en',
            locales: [
                {displayName: 'English', key: 'en', shortName: 'En'}
            ],
            translations: {en: {}}
        })
        this._sessionStorage = sessionStorage
        this.changeLanguage(this._config.defaultLocale)
    }
}