import {AppConfig} from "./app";
import {HttpConfig} from "./http";
import {i18nConfig} from "./i18n";
import {AuthConfig, SecurityConfig} from "./security";

export interface StaticConfig {
    app: AppConfig
    http?: HttpConfig
    i18n?: i18nConfig
    security?: SecurityConfig
    auth?: AuthConfig
    [others: string]: any
}