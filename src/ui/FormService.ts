import {
    FieldConfig,
    FormConfig,
    FormFieldType,
    FormValidationResult, PartialFieldConfig,
    PartialFormConfig, SyncFormValidateFunc, SyncValidateFunc,
    ValidationResult
} from "./FormModels";
import {Nullable, Dict, StringUtils, isDate, isDateTime, isTime, isYear, toArray} from '../common'
import {notEmpty} from "./ValidationService";
import {LookupItem} from "../data";

export interface FormService {
    getValidationResult(errorMessage?: string): ValidationResult
    getFormValidationResult(errorMessage?: Nullable<string>, fields?: Dict<ValidationResult>): FormValidationResult
    createFormConfig(forObject: Dict<any>, _config: PartialFormConfig): FormConfig
    createFieldConfig(fieldId: string, fieldValue: any,
                      fieldConfig?: PartialFieldConfig, formConfig?: PartialFormConfig): FieldConfig
    getDefaultFieldConfig(fieldId: string, type: FormFieldType, formConfig?: PartialFormConfig): FieldConfig
    guessType(fieldId: string, fieldValue: any): FormFieldType
    guessConfig(val: any, fieldType: FormFieldType, _?: PartialFieldConfig): PartialFieldConfig
    getGroupedFields(fieldsConfig: Dict<FieldConfig>): Dict<Dict<FieldConfig>>
    hasGroups(form: FormConfig): boolean
    validate(forObject: any, formConfig: FormConfig) : FormValidationResult
}

function getChoice(key: any, val: string, _str: StringUtils): LookupItem {
    return {key, val: _str.humanized_i18n(val)}
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
            columns: 1,
            readonly: false,
            hideLabels: false,
            includeSubmitButton: false,
            autoValidate: true,
            noValidate: true,
            ..._config,
            fieldsConfig: {
                ...Object.keys(forObject).reduce((a, fieldId) => ({...a, [fieldId]: null}), {}),
                ..._config.fieldsConfig
            },
            $$isComplete: true
        }

        if (config.includeSubmitButton) {
            config.fieldsConfig['$$submit'] = {
                ...this.getDefaultFieldConfig('$$submit', 'submit', config),
                hideLabel: true,
                label: 'Submit',
                type: 'submit'
            }
        }

        for (const fieldId in config.fieldsConfig) {
            if (!config.fieldsConfig.hasOwnProperty(fieldId))
                continue
            if (!forObject.hasOwnProperty(fieldId))
                forObject[fieldId] = null;
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
        if (this._str.isEmpty(result.label))
            result.label = this._str.humanized_i18n(fieldId)
        if (result?.choices == null)
            result.choices = []
        else if (result.choices?.constructor === Array) {
            if (result.choices.length == 0)
                result.choices = []
            else if (typeof result.choices[0] === 'string') {
                result.choices = result.choices.map(c => getChoice(c, c, this._str))
            }
            else {
                result.choices = (result.choices as LookupItem[]).map(c => getChoice(c.key, c.val, this._str))
            }
        }
        else {
            result.choices = Object.keys(result.choices).map(c => getChoice(c, result.choices[c], this._str))
        }

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
            result.choices = val.map(c => ({key: c, val: this._str.humanize(c)}))
            result.multiple = true
        }
        if (fieldType == 'password')
            result.required = true
        return result
    }

    getGroupedFields(fields: Dict<FieldConfig>): Dict<Dict<FieldConfig>> {
        return Object.keys(fields)
            .reduce((prev, fld) => {
                let grp = fields[fld].group ?? 'MISC'
                if (prev[grp])
                    prev[grp][fld] = fields[fld]
                else prev[grp] = {[fld]: fields[fld]}
                return prev
            }, {})
    }

    getColumns(fields: Dict<FieldConfig>, cols = 1): Dict<FieldConfig>[] {
        const fKeys = Object.keys(fields)
        if (cols < 1) cols = 1
        let result = new Array(cols).fill(0).map(_ => ({} as Dict<FieldConfig>))
        for (let i=0; i<fKeys.length; i++) {
            const at = Math.floor(i / (fKeys.length / cols))
            result[at][fKeys[i]] = fields[fKeys[i]]
        }
        return result
    }

    hasGroups(form: FormConfig): boolean {
        let fConf = form.fieldsConfig
        return Object.keys(fConf)
            .reduce((prev, fld) => (prev.indexOf(fConf[fld].group) > -1 ? prev : [...prev, fConf[fld].group]), [])
            .length > 1;
    }

    validate(forObject: any, formConfig: FormConfig): FormValidationResult {
        let result = this.getFormValidationResult(null,
            Object.keys(formConfig.fieldsConfig).reduce((prev, fldId) => ({...prev, [fldId]: this.getValidationResult()}), {}))
        const frmValidateFuncs = toArray<SyncFormValidateFunc>(formConfig.validate as any)
        for (const validate of frmValidateFuncs) {
            const vr = validate(forObject)
            if (this._str.isEmpty(vr))
                continue
            if (typeof vr === 'string') {
                result.hasError = true
                result.message = vr
            }
            else {
                Object.keys(vr).map(fldId => {
                    result.fields[fldId] = this.getValidationResult(vr[fldId])
                })
            }
            break
        }
        for (const [fldId, conf] of Object.entries(formConfig.fieldsConfig)) {
            const validators = toArray<SyncValidateFunc>(conf.validate as any)
            for (const validate of validators) {
                const vr = validate(forObject[fldId])
                result.fields[fldId] = this.getValidationResult(vr)
                if (result.fields[fldId].hasError)
                    break
            }
            if (!result.fields[fldId].hasError) {
                if (conf.required) {
                    result.fields[fldId] = this.getValidationResult(notEmpty(forObject[fldId]))
                }
            }
        }
        result.hasError = result.hasError ||
            Object.keys(result.fields).reduce((prev, id) => prev || result.fields[id].hasError, false)
        return result
    }

    constructor(protected _str: StringUtils) {}
}