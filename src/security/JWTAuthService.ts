import { SecurityService } from ".";
import { ConfigService, HttpService } from "..";
import { AuthService } from "./AuthService";

export class JWTAuthService extends AuthService {
    constructor(config: ConfigService, securityService: SecurityService, http: HttpService) {
        super(config, securityService, http)
        
        http.onRequesting.subscribe(cb => {
            let user = securityService.getCurrentUser()
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