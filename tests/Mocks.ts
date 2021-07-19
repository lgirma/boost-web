import {ConfigService, HttpService, SecurityService, User, NavigationService, HttpMethod} from "../src";
import {SessionStorageService} from "../src/session";

export function GetMockConfigService(initialConfig: any = {}): ConfigService {
    return {
        _config: initialConfig,
        get(section, defaultValue) {
            this._config[section] = {...defaultValue, ...this._config[section]}
            return this._config[section]
        }
    } as ConfigService
}

export function GetMockSessionStorageService(): SessionStorageService {
    return {
        _keyValues: {},
        getItem(key) {
            return JSON.parse(this._keyValues[key])
        },
        setItem(key, val) {
            this._keyValues[key] = JSON.stringify(val)
        },
        removeItem(key: string) {
            delete this._keyValues[key]
        }
    } as SessionStorageService
}

export function GetMockSecurityService(): SecurityService {
    return {
        _user: null as User,
        getCurrentPageBundle(): string {
            return "";
        },
        getCurrentUser(): User {
            return this._user;
        },
        getCurrentUserRole(): string {
            return "";
        },
        getRoleRootUrl(_: string): string { return '' },
        getSecureBundles(): string[] {
            return [];
        },
        gotoRoleHome(_: string[]): any { },
        gotoUserHome(_?: User): any { },
        init(): any { },
        isUserAuthenticated(): boolean {
            return this._user != null;
        },
        setUser(user: User, _?: boolean): any {
            this._user = user
        }

    } as SecurityService
}

let lastNavPath = ''

export function GetLastNavPath() {return lastNavPath}

export function GetMockNavService(): NavigationService {
    return {
        getCurrentPath() { return ""; },
        navTo(_: string) { lastNavPath = _ }
    }
}

export function ApiError(code = 400, body: any = null) {
    return {
        ok: false,
        redirected: false,
        status: code,
        statusText: code.toString(),
        body
    }
}

let lastRequest: {url: string, method: HttpMethod, body?: any} = null

export function GetLastMockHttpCall() {
    return lastRequest
}

export function GetMockHttpService(urlRoute?: (url: string, body?: any) => any): HttpService {
    if (urlRoute == null)
        urlRoute = _ => 'Hello, World!'
    return {
        onRequesting: undefined,
        onResponseError: undefined,
        onResponseNotOk: undefined,
        onResponseSuccess: undefined,
        get<T = any>(url: string, _?: RequestInit): Promise<T> {
            return this.request('get', url, null)
        },
        post<T = any>(url: string, body, _2): Promise<T> {
            return this.request('get', url, body)
        },
        request(method, url, body, _3): Promise<Response> {
            lastRequest = {url, method, body}
            return Promise.resolve(urlRoute(url, body));
        }

    }
}

export function getUser(name: string, fullName: string, roles: string[], primaryRole?: string): User {
    return {
        getFullName() {return fullName},
        getName(){return name},
        getPrimaryRole() {return primaryRole ?? roles[0]},
        getRoles() {return roles}
    }
}