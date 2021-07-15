import { ConfigService } from "../config";
import { User } from "./Models";

export interface SecurityConfig {
    RoleBundles?: { [key: string]: string }
    Roles?: { [key: string]: string }
    BundleRoles?: { [key: string]: string; }
    AuthPageUrl?: string,
    LogoutUrl?: string
    UnauthorizedPageUrl?: string
}

export interface SecurityService {
    init(isSecure?: boolean)
    getCurrentPageBundle(): string
    getCurrentUser(): User
    getCurrentUserRole(): string
    getRoleRootUrl(role: string): string
    getSecureBundles(): string[]
    gotoRoleHome(roles: string[])
    gotoUserHome(user?: User)
    isUserAuthenticated(): boolean
    setUser(user: User, goHome?: boolean)
}

export class SimpleSecurityService implements SecurityService {
    private _config: SecurityConfig
    private _userStore: User

    getCurrentPageBundle(): string {
        return window.location.pathname.replace('/', '').replace('.html', '');
    }

    getCurrentUser(): User {
        return this._userStore;
    }

    getCurrentUserRole(): string {
        return this._config.BundleRoles[this.getCurrentPageBundle()];
    }

    getRoleRootUrl(role: string): string {
        return this._config.RoleBundles[role];
    }

    getSecureBundles(): string[] {
        return Object.keys(this._config.Roles).map(r => this._config.RoleBundles[r]);
    }

    gotoRoleHome(roles: string[]) {
        window.location.href = '/' + (this.getRoleRootUrl(roles.find(_ => 1)) || 'error');
    }

    gotoUserHome(user: User = null) {
        if (user == null)
            user = this.getCurrentUser();

        this.gotoRoleHome(user.roles);
    }

    isUserAuthenticated(): boolean {
        return this._userStore != null;
    }

    setUser(user: User, goHome = true) {
        this._userStore = user;
        localStorage.setItem('user', user == null ? null : JSON.stringify(user))
        if (user != null && goHome)
            this.gotoUserHome(user);
    }

    init(isSecure = true) {
        const userJson = localStorage.getItem('user');
        const usr = JSON.parse(userJson);
        if (userJson != null)
            this._userStore = usr;
        const hasUserLoggedIn = this.isUserAuthenticated();

        if (isSecure && !hasUserLoggedIn) {
            window.location.href = this._config.AuthPageUrl;
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
            if (secureBundles.indexOf(bundle) > -1 && usr.roles.find(r => bundle === this._config.RoleBundles[r]) == null) {
                this.gotoUserHome(usr);
                return null;
            }
        }
    }

    constructor(config: ConfigService) {
        this._config = config.get<SecurityConfig>('security', {
            RoleBundles: {},
            Roles: {},
            BundleRoles: {},
            AuthPageUrl: '/auth',
            LogoutUrl: '/logout',
            UnauthorizedPageUrl: '/error'
        })
    }
}