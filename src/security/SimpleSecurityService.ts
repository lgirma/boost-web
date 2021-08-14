import {User} from "./Models";
import {SessionStorageService} from "../session";
import {NavigationService} from "../routing";
import {ConfigService} from "../config";
import {SecurityConfig, SecurityService} from "./SecurityService";

function parseBundle(url: string): string|null {
    if (url == null || url.length == 0)
        return null
    url = url.trim()
    return url.split('/').filter(Boolean)[0]
}

export class SimpleSecurityService implements SecurityService {
    protected _config: SecurityConfig
    protected _userStore: User
    protected _sessionStorage: SessionStorageService
    protected _nav: NavigationService;

    getCurrentPageBundle(): string {
        return this._nav.getCurrentPath().replace('/', '').replace('.html', '');
    }

    getCurrentUser<TUser extends User = User>(): TUser {
        return this._userStore as TUser;
    }

    getCurrentUserRole(): string {
        return this._config.BundleRoles[this.getCurrentPageBundle()];
    }

    getRoleRootUrl(role: string): string {
        return this._config.RoleBundles[role];
    }

    gotoUrl(url: string) {
        if (url == null || url.length == 0 || !this.isUserAuthenticated())
            this.gotoUserHome()
        if (url[0] != '/')
            url = '/' + url
        // TODO: Check if current role is allowed
        const secureBundles = this.getSecureBundles();
        const bundle = parseBundle(url)
        const usr = this.getCurrentUser()
        if (secureBundles.indexOf(bundle) > -1 && usr.getRoles().find(r => bundle === this._config.RoleBundles[r]) == null)
            this.gotoUserHome()
        else this._nav.navTo(url)
    }

    getSecureBundles(): string[] {
        return Object.keys(this._config.Roles).map(r => this._config.RoleBundles[r]);
    }

    gotoRoleHome(roles: string[]) {
        const primaryRole = roles.find(_ => 1)
        const rootUrl = this.getRoleRootUrl(primaryRole)
        this._nav.navTo(rootUrl ? `/${rootUrl}` : this._config.UnauthorizedPageUrl)
    }

    gotoUserHome(user: User = null) {
        if (user == null)
            user = this.getCurrentUser();
        if (user == null)
            this._nav.navTo(this._config.AuthPageUrl)
        this.gotoRoleHome(user.getRoles());
    }

    isUserAuthenticated(): boolean {
        return this._userStore != null;
    }

    setUser(user: User, goHome = true) {
        this._userStore = user;
        this._sessionStorage.setItem('user', user == null ? null : user)
        if (user != null && goHome)
            this.gotoUserHome(user);
    }

    init(isSecure = true) {
        const usr = this._sessionStorage.getItem<User>('user');
        if (usr != null)
            this._userStore = usr;
        const hasUserLoggedIn = this.isUserAuthenticated();

        if (isSecure && !hasUserLoggedIn) {
            this._nav.navTo(this._config.AuthPageUrl)
            return null;
        }
        if (!isSecure && hasUserLoggedIn) {
            this.gotoUserHome(usr);
            return null;
        }
        if (isSecure && hasUserLoggedIn) {
            // check if role is denied
            const bundle = this.getCurrentPageBundle();
            const secureBundles = this.getSecureBundles();
            if (secureBundles.indexOf(bundle) > -1 && usr.getRoles().find(r => bundle === this._config.RoleBundles[r]) == null) {
                this.gotoUserHome(usr);
                return null;
            }
        }
    }

    constructor(config: ConfigService, sessionStorage: SessionStorageService, nav: NavigationService) {
        this._config = config.get<SecurityConfig>('security', {
            RoleBundles: {},
            Roles: {},
            BundleRoles: {},
            AuthPageUrl: '/auth',
            LogoutUrl: '/logout',
            UnauthorizedPageUrl: '/error'
        })
        this._sessionStorage = sessionStorage
        this._nav = nav
    }
}