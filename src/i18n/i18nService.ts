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
     defaultLocale?: string
     /**
      * All locales your app supports
      * Default is `[ {displayName: 'English', key: 'en', shortName: 'En'} ]`
      */
     locales?: WebLocale[],
     translations?: i18nResource
}

export interface i18nService {
    getCurrentUserLanguage(): string;
    changeLanguage(lang: string);
    _(key: string, ...args): string
    exact(key: string, ...args): string
    addTranslations(res: i18nResource)
    getLanguages(): WebLocale[]
}