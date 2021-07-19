export interface LoginModel {
    userId: string,
    password: string
}

export interface User {
    getRoles(): string[]
    getFullName(): string
    getName(): string
    getPrimaryRole(): string
}