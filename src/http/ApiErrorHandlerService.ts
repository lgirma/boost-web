import {ConfigService} from "../config";
import {HttpConfig, HttpError, HttpErrorType} from ".";
import {ToastStateService} from "../ui";

export interface ApiError<TDetails = any> {
    code: string
    details: TDetails
}

export interface ApiErrorHandlerService {
    getApiError<TDetails = any>(apiResponse: any): ApiError<TDetails>
    handle(error: HttpError, handler: (apiError: ApiError) => void, defaultHandler?: (httpError: HttpError) => void): void
}

export class SimpleApiErrorHandlerService implements ApiErrorHandlerService {
    private readonly _config: HttpConfig

    getApiError<TDetails = any>(apiResponse: any): ApiError<TDetails> {
        return {
            code: apiResponse[this._config.errorCodeKey],
            details: apiResponse[this._config.errorDetailsKey]
        }
    }

    handle(error: HttpError, handler: (apiError: ApiError) => void, defaultHandler?: (httpError: HttpError) => void): void {
        if (error.isHandleable && error.body[this._config.errorCodeKey])
            handler(this.getApiError(error))
        else if (defaultHandler)
            defaultHandler(error)
        else {
            if (error.type == HttpErrorType.ERR_REQUEST) {
                this._toast.showError('ERR_HTTP_REQUEST')
            }
            else if (error.type == HttpErrorType.NO_CONNECTION) {
                this._toast.showError('ERR_HTTP_NO_CONNECTION')
            }
            else if (error.type == HttpErrorType.ERR_404) {
                this._toast.showError('ERR_HTTP_404')
            }
            else if (error.type == HttpErrorType.ERR_5XX) {
                this._toast.showError('ERR_HTTP_5XX')
            }
            else {
                this._toast.showError('ERR_HTTP_GENERIC')
            }
        }
    }

    constructor(config: ConfigService, private _toast: ToastStateService) {
        this._config = config.get('http', {errorCodeKey: 'code', errorDetailsKey: 'details'})
    }
}