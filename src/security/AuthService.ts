import { ConfigService } from "../config";
import { HttpService } from "../http";
import { LoginModel } from "./Models";
import { SecurityService } from "./SecurityService";

export interface AuthConfig {
    LoginApiUrl?: string,
    UserIdFieldName?: string,
    PasswordFieldName?: string
}

export abstract class AuthService {
    protected _config: AuthConfig
    protected _security: SecurityService
    protected _http: HttpService

    logout() {
        this._security.setUser(null)
        window.location.href = '/'
    }
    async login(loginData: LoginModel): Promise<void> {
        const {userId, password} = loginData;
        let loggedInUser = await this._http.post(this._config.LoginApiUrl, {
            [this._config.UserIdFieldName]: userId,
            [this._config.PasswordFieldName]: password
        })
        this._security.setUser(loggedInUser)
    }

    constructor(config: ConfigService, securityService: SecurityService, http: HttpService) {
        this._config = config.get<AuthConfig>('auth', {
            LoginApiUrl: 'auth/login',
            PasswordFieldName: 'password',
            UserIdFieldName: 'email'
        })
        this._security = securityService
        this._http = http
    }
}