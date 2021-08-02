import { HttpService } from "../http";

export interface BusyBarOptions {
    thickness?: number
    color?: string
}

export abstract class BusyBarService {
    abstract start(bar?)
    abstract stop(bar?)
    abstract createBar(options?: BusyBarOptions): any

    protected constructor(httpService: HttpService) {
        httpService.onRequesting.subscribe(() => this.start(this))
        httpService.onResponseSuccess.subscribe(() => this.stop(this))
        httpService.onResponseError.subscribe(() => this.stop(this))
        httpService.onResponseNotOk.subscribe(() => this.stop(this))
    }
}