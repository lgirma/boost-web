import { ConfigService } from "../config";
import { HttpService } from "../http";
import {LoginModel, User} from "./Models";
import { SecurityService } from "./SecurityService";
import {NavigationService} from "../routing";

export interface AuthConfig {
    LoginApiUrl?: string,
    UserIdFieldName?: string,
    PasswordFieldName?: string
}

export interface AuthService {
    logout()
    login(loginData:LoginModel): Promise<User>
}

export class SimpleAuthService implements AuthService {
    protected _config: AuthConfig
    protected _security: SecurityService
    protected _http: HttpService
    protected _nav: NavigationService

    logout() {
        this._security.setUser(null)
        this._nav.navTo('/')
    }
    async login(loginData: LoginModel): Promise<User> {
        const {userId, password} = loginData;
        let loggedInUser = await this._http.post(this._config.LoginApiUrl, {
            [this._config.UserIdFieldName]: userId,
            [this._config.PasswordFieldName]: password
        })
        this._security.setUser(loggedInUser)
        return loggedInUser
    }

    constructor(config: ConfigService, securityService: SecurityService, http: HttpService, nav: NavigationService) {
        this._config = config.get<AuthConfig>('auth', {
            LoginApiUrl: 'auth/login',
            PasswordFieldName: 'password',
            UserIdFieldName: 'email'
        })
        this._security = securityService
        this._http = http
        this._nav = nav
    }
}