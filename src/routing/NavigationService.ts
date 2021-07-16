export interface NavigationService {
    navTo(url: string)
    getCurrentPath(): string;
}

export class WindowNavigationService implements NavigationService {
    navTo(url: string) {
        window.location.href = url
    }
    getCurrentPath(): string {
        return window.location.pathname
    }
}