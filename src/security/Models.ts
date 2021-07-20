import {WebImage} from "../common";

export interface LoginModel {
    userId: string,
    password: string
}
new Image()
export interface User {
    getRoles(): string[]
    getFullName(): string
    getName(): string
    getPrimaryRole(): string
    getAvatar(size?: number): Promise<WebImage>
}