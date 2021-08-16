import {LoginModel, User} from "./Models";
import {Adapter} from "../common";

export interface AuthConfig {
    LoginApiUrl?: string,
    UserIdFieldName?: string,
    PasswordFieldName?: string
    UserAdapter?: Adapter<User>
}

export interface AuthService {
    login<TUser extends User = User>(loginData:LoginModel): Promise<TUser>
}