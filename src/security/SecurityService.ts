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
    getCurrentUser<TUser extends User = User>(): TUser
    getCurrentUserRole(): string
    getRoleRootUrl(role: string): string
    getSecureBundles(): string[]
    gotoRoleHome(roles: string[])
    gotoUserHome(user?: User)
    isUserAuthenticated(): boolean
    setUser(user: User, goHome?: boolean)
    gotoUrl(url: string)
}
