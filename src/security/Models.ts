export interface LoginModel {
    userId: string,
    password: string
}

export interface User {
    token: string
    roles: string[],
    fullName: string,
    name: string,
    primaryRole: string
}