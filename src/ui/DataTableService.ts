import {
    DataTableConfig,
    DataTableOptions, DataTableOptionsFrom,
    DataTablePagination,
} from "./DataTableModels";
import {FormService} from "./FormService";
import {StringUtils} from "../common";
import {ConfigService} from "../config";
import {DataTableFilter, PagedData} from "../data";

export interface DataTableService {
    getDefaultFilter(): DataTableFilter
    getData(options: DataTableOptions, filter: DataTableFilter): Promise<PagedData>
    getConfig(options: DataTableOptionsFrom): Promise<DataTableOptions>
    getPagination(filter: DataTableFilter, data: PagedData): DataTablePagination
}

export class DataTableStateService implements DataTableService {
    private _config: DataTableConfig

    getDefaultFilter(): DataTableFilter {
        return {sort: [], pageSize: 10, currentPage: 0}
    }

    async getData(options: DataTableOptions, filter: DataTableFilter): Promise<PagedData> {
        return await options.dataSource.getRows(filter ?? this.getDefaultFilter(),
            this._config.filterAdapter,
            this._config.pagedDataAdapter)
    }
    async getConfig(options: DataTableOptionsFrom): Promise<DataTableOptions> {
        if (options.$$isComplete)
            return options as any
        const result: DataTableOptions = {
            dataSource: null,
            columns: {},
            selectableRows: true,
            commands: [],
            skip: [],
            ...options as any,
            $$isComplete: true
        }
        result.columns ??= {}
        let peekRows = (await options.dataSource.getRows({pageSize: 1, currentPage: 0, sort: []},
            this._config.filterAdapter,
            this._config.pagedDataAdapter)).items
        if (peekRows.length == 0)
            return result
        const row = peekRows[0]
        result.columns = [...new Set([...Object.keys(row), ...Object.keys(result.columns)])]
            .filter(col => result.skip.indexOf(col) == -1)
            .reduce((prev, colKey) => ({...prev, [colKey]: {...result.columns?.[colKey]}}), {})
        for (const key in result.columns) {
            if (result.skip.indexOf(key) > -1)
                continue
            result.columns[key] ??= {} as any
            const config = this._formService.createFieldConfig(key,
                result.columns[key].value != null ? result.columns[key].value(row) : row[key])
            result.columns[key] = {
                type: config.type,
                id: config.id,
                header: this._str.humanized_i18n(key),
                hidden: false,
                isHeaderHtml: false,
                sortable: result.columns[key].value == null,
                template: null,
                ...result.columns[key]
            }
        }
        if (this._str.isEmpty(result.titleField)) {
            const nonHiddenFields = Object.keys(result.columns).filter(k => !result.columns[k].hidden)
            const titleFields = ['title', 'name', 'firstName', 'fullName']
            result.titleField = nonHiddenFields.find(f => titleFields.indexOf(f) > -1)
            if (result.titleField == null)
                result.titleField = nonHiddenFields[0]
            result.columns = {
                [result.titleField]: result.columns[result.titleField],
                ...result.columns
            }
        }
        return result
    }
    getPagination(filter: DataTableFilter, data: PagedData): DataTablePagination {
        return {
            canGoFirst: filter.currentPage != 0,
            canGoPrev: filter.currentPage != 0,
            canGoNext: filter.currentPage < data.pageCount - 1,
            canGoLast: filter.currentPage < data.pageCount - 1
        }
    }

    constructor(private _formService: FormService, private _str: StringUtils, appConfig: ConfigService) {
        this._config = appConfig.get('data', {
            filterAdapter: from => from,
            pagedDataAdapter: pagedData => pagedData
        })
    }

}