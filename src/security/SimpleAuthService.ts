import {SecurityService} from "./SecurityService";
import {HttpService} from "../http";
import {NavigationService} from "../routing";
import {LoginModel, User} from "./Models";
import {ConfigService} from "../config";
import {AuthConfig, AuthService} from "./AuthService";

export class SimpleAuthService implements AuthService {
    protected _config: AuthConfig
    protected _security: SecurityService
    protected _http: HttpService
    protected _nav: NavigationService

    logout() {
        this._security.setUser(null)
        this._nav.navTo('/')
    }
    async login<TUser extends User = User>(loginData: LoginModel): Promise<TUser> {
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