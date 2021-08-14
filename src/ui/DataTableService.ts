import {ConstDataSource, DataTableFilter, DataTableOptions, DataTablePagination, TableData} from "./DataTableModels";
import {FormService} from "./FormService";
import {StringUtils} from "../common";

export interface DataTableService {
    getDefaultFilter(): DataTableFilter
    getData(options: DataTableOptions, filter: DataTableFilter): Promise<TableData>
    getConfig(options: Partial<DataTableOptions>): Promise<DataTableOptions>
    getPagination(filter: DataTableFilter, data: TableData): DataTablePagination
}

export class DataTableStateService implements DataTableService {
    getDefaultFilter(): DataTableFilter {
        return {sort: [], pageSize: 10, currentPage: 0}
    }

    async getData(options: DataTableOptions, filter: DataTableFilter): Promise<TableData> {
        return await options.dataSource.getRows(filter ?? this.getDefaultFilter())
    }

    async getConfig(options: Partial<DataTableOptions>): Promise<DataTableOptions> {
        if (options.$$isComplete)
            return options as any
        const result: DataTableOptions = {
            dataSource: new ConstDataSource([{fullName: '', age: 5, price: '4.5'}]),
            columns: {},
            selectableRows: true,
            ...options,
            $$isComplete: true
        }
        result.columns ??= {}
        let peekRows = (await options.dataSource.getRows({pageSize: 1, currentPage: 0, sort: []})).items
        if (peekRows.length == 0)
            return result
        const row = peekRows[0]
        result.columns = Object.keys(row)
            .reduce((prev, colKey) => ({...prev, [colKey]: {...result.columns?.[colKey]}}), {})
        for (const key in row) {
            const config = this._formService.createFieldConfig(key, row[key])
            result.columns[key] = {
                type: config.type,
                id: config.id,
                header: this._str.humanized_i18n(key),
                hidden: false,
                isHeaderHtml: false,
                sortable: true,
                template: null,
                ...result.columns[key]
            }
        }
        return result
    }
    getPagination(filter: DataTableFilter, data: TableData): DataTablePagination {
        return {
            canGoFirst: filter.currentPage != 0,
            canGoPrev: filter.currentPage != 0,
            canGoNext: filter.currentPage != data.pageCount - 1,
            canGoLast: filter.currentPage != data.pageCount - 1
        }
    }

    constructor(private _formService: FormService, private _str: StringUtils) { }

}