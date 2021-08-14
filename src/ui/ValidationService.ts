import {ValidateFunc} from "./FormModels";
import {lazyC} from "../di";

const special_char_regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/

export const MIME_IMAGES = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/webp', 'image/bmp', 'image/tiff']
export const MIME_VIDEO = ['video/mp4', 'video/webv', 'video/ogv']
export const MIME_AUDIO = ['audio/mpeg', 'audio/ogg', 'audio/x-m4a', 'audio/3gpp']
export const MIME_PDF = ['application/pdf']
export const MIME_MS_EXCEL = ['vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
export const MIME_MS_WORD = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']


const i18n = lazyC('i18n')
const str = lazyC('string-utils')


export function getMinLenValidator(length = 1): ValidateFunc {
    return val => {
        if (str().isEmpty(val))
            return i18n()._('ERR_VALIDATION_EMPTY_FIELD')
        else if (val.length < length)
            return i18n()._('ERR_VALIDATION_MIN_LENGTH', length)
        return ''
    }
}

export function notEmpty(val, errorMessage = 'ERR_VALIDATION_EMPTY_FIELD') {
    if (val == null) return i18n()._(errorMessage)
    if (val?.constructor === globalThis.FileList)
        return val.length == 0 ? i18n()._(errorMessage) : ''
    if (Array.isArray(val))
        return val.length == 0 ? i18n()._(errorMessage) : ''
    if (typeof val === 'string')
        return str().isEmpty(val) ? i18n()._(errorMessage) : '';
    return ''
}

export function validName(val, errorMessage = 'ERR_VALIDATION_NAME') {
    if (/[<>/\\{}*#~`%]+/.test(val))
        return i18n()._(errorMessage);
    return '';
}

export function fileTypeValidator(fileMimeList: string[], errorMessage = 'ERR_VALIDATION_FILES') {
    return (val) => {
        const fileList = Array.from(val as FileList)
        if (fileList.length == 0)
            return ''
        if (fileList.find(f => fileMimeList.indexOf(f.type) == -1) != null)
            return i18n()._(errorMessage)
        return ''
    }
}

export function imgTypeFile(errorMessage = 'ERR_VALIDATION_IMAGES') {
    return fileTypeValidator(MIME_IMAGES, errorMessage)
}

export function maxFileSize(val, errorMessage = 'ERR_VALIDATION_FILE_SIZE', maxUploadFileSize = 1024 * 1024 * 10) {
    if (Array.from(val as FileList).find(f => f.size > maxUploadFileSize) != null)
        return i18n()._(errorMessage, str().getFriendlyFileSize(maxUploadFileSize))
    return ''
}

export function getStrongPasswordValidator({minLength = 8, specialChars = true} = {}) {
    return val => {
        if (str().isEmpty(val))
            return i18n()._('ERR_VALIDATION_EMPTY_FIELD')
        else if (val.length < minLength)
            return i18n()._('ERR_VALIDATION_PASSWORD_LEN', minLength)
        else if (val.toLowerCase() === val || val.toUpperCase() === val)
            return i18n()._('ERR_VALIDATION_PASSWORD_CASE')
        else if (specialChars && !special_char_regex.test(val))
            return i18n()._('ERR_VALIDATION_PASSWORD_SPECIAL_CHAR')
        return ''
    }
}