import {FormFieldType} from "./FormModels";
import {ApiError} from "../http";
import {Dict} from "../common";

export interface DataTableOptions {
    columns: Dict<DataTableColumn>
    dataSource: DataTableDataSource
    selectableRows: boolean
    $$isComplete: boolean
}

export interface DataTableColumn {
    id: string
    header: string
    isHeaderHtml: boolean
    sortable: boolean
    hidden: boolean
    type: FormFieldType
    template: null | ((cellData: any, row?: any) => any)
}

export interface SortInfo { by: string, desc?: boolean }

export interface DataTableFilter {
    currentPage: number
    pageSize: number
    sortBy: SortInfo[]
}

export interface TableData {
    items: any[]
    pageCount: number
    totalCount: number
}

export interface DataTableDataSource {
    getRows(filter: DataTableFilter): Promise<TableData>
}

export class ConstDataSource implements DataTableDataSource {
    constructor(private _rows: any[]) {}

    async getRows(filter: DataTableFilter): Promise<TableData | null> {
        return {
            items: this._rows.filter((_, n) =>
                n >= filter.currentPage * filter.pageSize
                && n < (filter.currentPage + 1) * filter.pageSize),
            pageCount: this._rows.length / filter.pageSize,
            totalCount: this._rows.length
        }
    }
}

export class HttpDataSource implements DataTableDataSource {

    constructor(private _url: string, private _apiErrorHandler: (err: ApiError) => void = null) {}

    async getRows(filter: DataTableFilter): Promise<TableData | null> {
        const _http = globalThis.c('http')
        const _apiError = globalThis.c('api-error')
        try {
            return await _http.post(this._url, filter)
        }
        catch (e) {
            _apiError.handle(e, this._apiErrorHandler)
            return null
        }
    }
}