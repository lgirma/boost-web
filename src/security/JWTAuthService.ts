import { SecurityService, SimpleAuthService } from ".";
import {ConfigService, HttpService, NavigationService, User} from "..";

export interface JWTAuthenticatedUser extends User {
    token: string
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
                this._security.logout()
            }
        })
    }
}