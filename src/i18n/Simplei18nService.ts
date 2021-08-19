import {SessionStorageService} from "../session";
import {ConfigService} from "../config";
import {i18nConfig, i18nResource, i18nService} from "./i18nService";

const engLocale = {displayName: 'English', key: 'en', shortName: 'En'}
const userLangKey = 'userLanguage'

export class Simplei18nService implements i18nService {
    _dictionary = {}
    _currentLang: string
    _config: i18nConfig
    _sessionStorage: SessionStorageService

    _(key: string, ...args): string {
        return this.exact(key, ...args) ?? key;
    }

    exact(key: string, ...args): string {
        if (key == null || key.trim().length == 0)
            return ''
        const currLang = this._currentLang ?? this.getCurrentUserLanguage();
        let resource = this._config.translations[currLang]
        if (resource == null)
            return key
        let result = resource[key];
        if (result === undefined && currLang != this._config.defaultLocale)
            result = this._config.translations[this._config.defaultLocale][key];
        if (result != null) {
            for (let i = 0; i < args.length; i++) {
                result = result.replace(`{${i}}`, args[i]);
            }
        }
        return result
    }

    changeLanguage(lang: string) {
        this._sessionStorage.setItem(userLangKey, lang);
        this._currentLang = lang;
    }

    getCurrentUserLanguage(): string {
        return this._currentLang
            ?? (this._currentLang = this._sessionStorage.getItem(userLangKey) || this._config.defaultLocale || engLocale.key);
    }

    addTranslations(res: i18nResource) {
        const langKeys = Object.keys(res);
        for (let i = 0; i < langKeys.length; i++) {
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
            defaultLocale: engLocale.key,
            locales: [engLocale],
            translations: {en: {}}
        })
        this._sessionStorage = sessionStorage
        this.changeLanguage(this._sessionStorage.getItem(userLangKey) ?? this._config.defaultLocale)
    }

    getLanguages() {
        return this._config.locales
    }
}