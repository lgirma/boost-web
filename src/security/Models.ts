export interface LoginModel {
    userId: string,
    password: string
}

export interface User {
    roles: string[]
    fullName: string
    name: string
    primaryRole: string
}