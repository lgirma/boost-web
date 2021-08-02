import {LoginModel, User} from "./Models";

export interface AuthConfig {
    LoginApiUrl?: string,
    UserIdFieldName?: string,
    PasswordFieldName?: string
}

export interface AuthService {
    logout()
    login<TUser extends User = User>(loginData:LoginModel): Promise<TUser>
}