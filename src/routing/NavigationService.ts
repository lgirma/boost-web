export interface NavigationService {
    navTo(url: string)
    getCurrentPath(): string;
}

export interface NavigationEventData {
    cancel: boolean
    url: string
}