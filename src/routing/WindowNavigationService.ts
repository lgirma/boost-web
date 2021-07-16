import {AppEvent} from "../events";
import {NavigationEventData, NavigationService} from "./NavigationService";

export class WindowNavigationService implements NavigationService {
    onNavigating = new AppEvent<NavigationEventData>()
    onNavigated = new AppEvent<string>()

    navTo(url: string) {
        let navData = {url, cancel: false}
        this.onNavigating.publish(navData)
        if (navData.cancel)
            return
        window.location.href = url
        this.onNavigated.publish(url)
    }
    getCurrentPath(): string {
        return window.location.pathname
    }
}