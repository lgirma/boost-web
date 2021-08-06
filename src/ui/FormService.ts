import {
    FieldConfig,
    FormConfig,
    FormFieldType,
    FormValidationResult, PartialFieldConfig,
    PartialFormConfig,
    ValidationResult
} from "./FormModels";
import {Nullable, Dict, StringUtils, isDate, isDateTime, isTime, isYear} from '../common'

export interface FormService {
    getValidationResult(errorMessage?: string): ValidationResult
    getFormValidationResult(errorMessage?: Nullable<string>, fields?: Dict<ValidationResult>): FormValidationResult
    createFormConfig(forObject: Dict<any>, _config: PartialFormConfig): FormConfig
    createFieldConfig(fieldId: string, fieldValue: any,
                      fieldConfig?: PartialFieldConfig, formConfig?: PartialFormConfig): FieldConfig
    getDefaultFieldConfig(fieldId: string, type: FormFieldType, formConfig?: PartialFormConfig): FieldConfig
    guessType(fieldId: string, fieldValue: any): FormFieldType
    guessConfig(val: any, fieldType: FormFieldType, _?: PartialFieldConfig): PartialFieldConfig
}

export class SimpleFormService implements FormService {
    getValidationResult(errorMessage?: string): ValidationResult {
        return {
            message: errorMessage ?? '',
            hasError: !this._str.isEmpty(errorMessage ?? null)
        }
    }

    getFormValidationResult(errorMessage?: Nullable<string>, fields?: Dict<ValidationResult>): FormValidationResult {
        return {
            message: errorMessage ?? '',
            hasError: !this._str.isEmpty(errorMessage ?? null) ||
                (fields != null && Object.keys(fields).find(k => fields[k].hasError) != null),
            fields: {...fields}
        }
    }

    createFormConfig(forObject: Dict<any>, _config: PartialFormConfig = {}): FormConfig {
        _config ??= {}
        let config: FormConfig = {
            scale: 1,
            readonly: false,
            hideLabels: false,
            excludeSubmitButton: false,
            autoValidate: true,
            noValidate: true,
            ..._config,
            fieldsConfig: {
                ...Object.keys(forObject).reduce((a, fieldId) => ({...a, [fieldId]: null}), {}),
                ..._config.fieldsConfig
            },
            $$isComplete: true
        }

        if (!config.excludeSubmitButton) {
            config.fieldsConfig['$$submit'] = {
                ...this.getDefaultFieldConfig('$$submit', 'submit', config),
                hideLabel: true,
                label: 'Submit',
                type: 'submit'
            }
        }

        for (const fieldId in forObject) {
            if (!forObject.hasOwnProperty(fieldId))
                continue
            config.fieldsConfig[fieldId] = this.createFieldConfig(fieldId, forObject[fieldId], config.fieldsConfig[fieldId], config)
        }

        return config;
    }

    createFieldConfig(fieldId: string, fieldValue: any,
                      fieldConfig?: PartialFieldConfig, formConfig?: PartialFormConfig): FieldConfig {
        let type = fieldConfig?.type ?? this.guessType(fieldId, fieldValue)

        let result = {
            ...this.getDefaultFieldConfig(fieldId, type, formConfig),
            ...this.guessConfig(fieldValue, type, fieldConfig),
            ...fieldConfig,
        } as FieldConfig
        if (this._str.isEmpty(result.label)) {
            result.label = this._str.humanize(fieldId)
        }
        result.choices = (result?.choices == null
            ? {}
            : (result.choices?.constructor === Array
                ? (result.choices as string[]).reduce((acc, b) => ({...acc, [b]: b}), {})
                : result.choices))

        return result
    }

    getDefaultFieldConfig(fieldId: string, type: FormFieldType, formConfig?: PartialFormConfig): FieldConfig {
        return {
            scale: formConfig?.scale ?? 1,
            readonly: formConfig?.readonly ?? false,
            hideLabel: formConfig?.hideLabels ?? false,
            colSpan: 1,
            icon: '',
            helpText: '',
            validationResult: {
                message: '',
                hasError: false
            },
            id: fieldId,
            multiple: false,
            type: type,
            label: '',
            choices: []
        }
    }

    guessType(fieldId: string, fieldValue: any): FormFieldType {

        let table: { [regex: string]: FormFieldType } = {
            'password$': 'password',
            'email$': 'email',
            'name$': 'name',
            'quantity$|number$': 'number',
            '^amount|amount$|^price|price$': 'money',
            '^date|date$': 'date', '^year|year$': 'year', '^month|month$': 'month',
            '^phone|phone$': 'tel',
            '^language|language$': 'language',
            '^rating|rating$': 'rating'
        }
        const fieldIdLower = fieldId.toLowerCase()

        for (const reg in table) {
            if (RegExp(reg).test(fieldIdLower))
                return table[reg]
        }
        if (fieldValue == null)
            return 'text';

        const jsType = typeof (fieldValue);

        if (jsType === 'boolean')
            return 'checkbox';
        if (jsType === 'string') {
            if (isDateTime(fieldValue))
                return 'datetime-local';
            if (isDate(fieldValue))
                return 'date';
            if (isTime(fieldValue))
                return 'time';
            if (isYear(fieldValue))
                return 'year';
            return 'text';
        }
        if (jsType === 'number')
            return 'number';
        if (fieldValue.constructor === Array)
            return 'radio';
        if (jsType === 'object' && fieldValue.constructor === Object)
            return 'composite'

        return 'text';
    }

    guessConfig(val: any, fieldType: FormFieldType, _?: PartialFieldConfig): PartialFieldConfig {
        let result: Partial<FieldConfig> = {}
        if (val != null && val.constructor === Array && fieldType == 'radio') {
            result.choices = val.reduce((acc, el) => ({...acc, [el]: this._str.humanize(el)}), {})
            result.multiple = true
        }
        if (fieldType == 'password')
            result.required = true
        return result
    }

    constructor(protected _str: StringUtils) {}
}