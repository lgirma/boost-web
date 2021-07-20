import { SecurityService } from ".";
import {ConfigService, HttpService, NavigationService, User, WebImage} from "..";
import { SimpleAuthService } from "./AuthService";

export class JWTAuthenticatedUser implements User {
    fullName: string;
    name: string;
    primaryRole: string;
    roles: string[];
    token: string
    avatar: string

    getFullName(): string {return this.fullName}
    getName(): string {return this.name}
    getPrimaryRole(): string {return this.primaryRole}
    getRoles(): string[] {return this.roles}
    getAvatar(_?): Promise<WebImage> {
        return Promise.resolve(this.avatar)
    }
}

export class JWTAuthService extends SimpleAuthService {
    constructor(config: ConfigService, securityService: SecurityService, http: HttpService, nav: NavigationService) {
        super(config, securityService, http, nav)
        
        http.onRequesting.subscribe(cb => {
            let user = securityService.getCurrentUser<JWTAuthenticatedUser>()
            if (user) {
                cb.headers['Authorization'] = `Bearer ${user.token}`
            }
        })

        http.onResponseNotOk.subscribe(response => {
            let authHeader = response.headers.get('WWW-Authenticate')
            if (authHeader && authHeader.indexOf('Bearer error="invalid_token"') > -1) {
                this.logout()
            }
        })
    }
}