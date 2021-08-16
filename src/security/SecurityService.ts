import { User } from "./Models";
import {Dict} from "../common";

export interface SecurityConfig {
    /**
     * A map of roles and their primary root url
     */
    RoleBundles?: Dict<string>
    /**
     * List of root urls that any un-authenticated user can access
     */
    UnsecureBundles?: string[]
    /**
     * List of all roles
     */
    Roles?: string[]
    /**
     * Url of the login page
     */
    AuthBundle?: string
    /**
     * Url of the logout page
     */
    LogoutUrl?: string
    /**
     * Url to redirect to up on attempt to access un-authorized page.
     */
    UnauthorizedPageUrl?: string
}

export interface SecurityService {
    init(isSecure?: boolean): boolean
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
    logout()
}
