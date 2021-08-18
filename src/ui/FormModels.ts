import {Dict, OneOrMany, Nullable} from "../common";
import {LookupItem} from "../data";

export type FieldsConfig = Record<string, FieldConfig>

export interface FieldConfig extends Partial<HTMLInputElement> {
    id: string
    icon?: string
    type: FormFieldType
    colSpan: number
    helpText?: string
    helpTextKey?: string
    label: string
    labelKey?: string
    placeholderKey?: string
    validationResult?: ValidationResult
    customOptions?: any,
    maxlength?: string
    multiple?: boolean
    choices: LookupItem[]
    variation?: string
    hideLabel: boolean
    scale: number
    readonly: boolean
    validate?: OneOrMany<ValidateFunc>
    group?: string
}

export interface FormConfig extends Partial<HTMLFormElement>/*, WebFormEvents*/ {
    fieldsConfig: FieldsConfig
    validate?: OneOrMany<FormValidateFunc>
    scale?: number
    columns?: number
    hideLabels?: boolean
    readonly?: boolean
    validationResult?: FormValidationResult
    /**
     * Do not include a default submit button
     */
    includeSubmitButton?: boolean
    /**
     * If true, should render a <div> or similar panel instead of a <formConfig>
     */
    excludeFormTag?: boolean
    /**
     * Whether the config is created from createFormConfig() call.
     */
    $$isComplete?: boolean
    /**
     * Whether values in forObject are updated up on user input.
     */
    syncValues?: boolean
    /**
     * Whether to validate the form automatically up on submission.
     */
    autoValidate?: boolean
}

export interface ValidationResult {
    message?: string,
    hasError: boolean
}

export interface FormValidationResult extends ValidationResult{
    fields: {
        [key: string]: ValidationResult;
    }
}

type ValidationFunc<T = string> = (val: any, errorMessage?: string) => T|null|undefined
export type AsyncValidateFunc = ValidationFunc<Promise<string>>
export type SyncValidateFunc = ValidationFunc
export type ValidateFunc = Nullable<SyncValidateFunc | AsyncValidateFunc>
export type SyncFormValidateFunc = Nullable<ValidationFunc<string | Dict<string>>>
export type FormValidateFunc = Nullable<ValidationFunc<Promise<string> | string | Dict<string> | Promise<Dict<string>>>>

/*export interface WebFormEvents {
    onValidation?: (e: Event, validationResult: FormValidationResult) => void
}

export interface WebFormFieldEvents {
    onValidation?: (e: Event, validationResult: ValidationResult) => void
}*/

export type HTMLInputType =
    'button' |
    'checkbox' |
    'color' |
    'date' |
    'datetime-local' |
    'email' |
    'file' |
    'hidden' |
    'image' |
    'month' |
    'number' |
    'password' |
    'radio' |
    'range' |
    'reset' |
    'search' |
    'submit' |
    'tel' |
    'text' |
    'time' |
    'url' |
    'week';

export type FormFieldType =  HTMLInputType | 'name' | 'files' | 'select' |
    'toggle' | 'textarea' | 'markdown' | 'reCaptcha' | 'year' |
    'multiselect-checkbox' | 'composite' | 'version' | 'avatar' | 'city' | 'country' | 'ipv4' | 'ipv6' | 'guid' |
    'isbn' | 'location' | 'language' | 'money' | 'timezone' | 'title' | 'rating' | 'sourcecode' |
    /**
     * Where use uploads one or more preview-able images
     */
    'gallery' |
    /**
     * where new items can be added or removed
     */
    'list' |
    /**
     * Choice of one or more items fetched from a paged data source
     */
    'autocomplete';

export const SimpleTextTypes : FormFieldType[] = [
    'text', 'password', 'date', 'datetime-local', 'email', 'search', 'url', 'time', 'month', 'week', 'tel'
]

export type PartialFieldConfig = Omit<Partial<FieldConfig>, 'choices'> & {
    choices?: string[] | Dict<string> | LookupItem[]
}
export type PartialFormConfig = Omit<Partial<FormConfig>, 'fieldsConfig'> & {
    fieldsConfig?: Dict<Partial<FieldConfig>>
}