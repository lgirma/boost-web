import {Nullable, StringUtils} from "../common";
import {ValidateFunc} from "./FormModels";

const special_char_regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/

export const MIME_IMAGES = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/webp', 'image/bmp', 'image/tiff']
export const MIME_VIDEO = ['video/mp4', 'video/webv', 'video/ogv']
export const MIME_AUDIO = ['audio/mpeg', 'audio/ogg', 'audio/x-m4a', 'audio/3gpp']
export const MIME_PDF = ['application/pdf']
export const MIME_MS_EXCEL = ['vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
export const MIME_MS_WORD = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

export interface PasswordStrength {
    minLength: number
    specialChars: boolean
}

export interface ValidationService {
    getMinLenValidator(length?: number): ValidateFunc
    notEmpty(val: any, errorMessage?: string): Nullable<string>
    validName(val: any, errorMessage?: string): Nullable<string>
    fileTypeValidator(fileMimeList: string[], errorMessage?: string): ValidateFunc
    imgTypeFile(errorMessage?: string): ValidateFunc
    maxFileSize(val: any, errorMessage?: string, maxUploadFileSize?: number): Nullable<string>
    getStrongPasswordValidator(options?: PasswordStrength): ValidateFunc
}

export class SimpleValidationService implements ValidationService {
    getMinLenValidator(length = 1): ValidateFunc {
        return val => {
            if (this._str.isEmpty(val))
                return 'ERR_VALIDATION_EMPTY_FIELD'
            else if (val.length < length)
                return 'ERR_VALIDATION_MIN_LENGTH'
            return ''
        }
    }

    notEmpty(val, errorMessage = 'ERR_VALIDATION_EMPTY_FIELD') {
        if (val == null) return errorMessage
        if (val?.constructor === FileList)
            return val.length == 0 ? errorMessage : ''
        if (Array.isArray(val))
            return val.length == 0 ? errorMessage : ''
        if (typeof val === 'string')
            return this._str.isEmpty(val) ? errorMessage : '';
        return ''
    }

    validName(val, errorMessage = 'ERR_VALIDATION_NAME') {
        if (/[<>/\\{}*#~`%]+/.test(val)) return errorMessage;
        return '';
    }

    fileTypeValidator(fileMimeList: string[], errorMessage = 'ERR_VALIDATION_FILES') {
        return (val) => {
            const fileList = Array.from(val as FileList)
            if (fileList.length == 0)
                return ''
            if (fileList.find(f => fileMimeList.indexOf(f.type) == -1) != null)
                return errorMessage
            return ''
        }
    }

    imgTypeFile(errorMessage = 'ERR_VALIDATION_IMAGES') {
        return this.fileTypeValidator(MIME_IMAGES, errorMessage)
    }

    maxFileSize(val, errorMessage = 'ERR_VALIDATION_FILE_SIZE', maxUploadFileSize = 1024 * 1024 * 10) {
        if (Array.from(val as FileList).find(f => f.size > maxUploadFileSize) != null)
            return errorMessage.replace('{0}', this._str.getFriendlyFileSize(maxUploadFileSize));
        return ''
    }

    getStrongPasswordValidator({minLength = 8, specialChars = true} = {}) {
        return val => {
            if (this._str.isEmpty(val))
                return 'ERR_VALIDATION_EMPTY_FIELD'
            else if (val.length < minLength)
                return 'ERR_VALIDATION_PASSWORD_LEN'
            else if (val.toLowerCase() === val || val.toUpperCase() === val)
                return 'ERR_VALIDATION_PASSWORD_CASE'
            else if (specialChars && !special_char_regex.test(val))
                return 'ERR_VALIDATION_PASSWORD_SPECIAL_CHAR'
            return ''
        }
    }

    constructor(protected _str: StringUtils) {}
}