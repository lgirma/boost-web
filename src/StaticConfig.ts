import {AppConfig} from "./app";
import {HttpConfig} from "./http";
import {i18nConfig} from "./i18n";
import {AuthConfig, SecurityConfig} from "./security";
import {CrudConfig, DataTableConfig} from "./ui";
import {LookupConfig} from "./data";

export interface StaticConfig {
    app?: AppConfig
    http?: HttpConfig
    i18n?: i18nConfig
    security?: SecurityConfig
    auth?: AuthConfig
    data?: DataTableConfig
    lookup?: LookupConfig
    crud?: CrudConfig
    [others: string]: any
}