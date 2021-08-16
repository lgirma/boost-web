import {FormFieldType} from "./FormModels";
import {ApiError} from "../http";
import {Adapter, Dict} from "../common";

export interface DataTableConfig {
    filterAdapter?: FilterAdapter
    pagedDataAdapter?: PagedDataAdapter
}

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
    sort: SortInfo[]
}

export interface PagedData {
    items: any[]
    pageCount: number
    totalCount: number
}

export interface DataTableDataSource {
    getRows(filter: DataTableFilter, filterAdapter: FilterAdapter, dataAdapter: PagedDataAdapter): Promise<PagedData>
}

export type FilterAdapter = Adapter<any, DataTableFilter>
export type PagedDataAdapter = Adapter<PagedData, any>

export interface DataTablePagination {
    canGoFirst: boolean
    canGoPrev: boolean
    canGoNext: boolean
    canGoLast: boolean
}

export class ConstDataSource implements DataTableDataSource {
    constructor(private _rows: any[]) {}

    async getRows(filter: DataTableFilter, _, _2): Promise<PagedData | null> {
        return {
            items: this._rows.filter((_, n) =>
                n >= filter.currentPage * filter.pageSize
                && n < (filter.currentPage + 1) * filter.pageSize),
            pageCount: Math.ceil(this._rows.length / filter.pageSize),
            totalCount: this._rows.length
        }
    }
}

export class HttpDataSource implements DataTableDataSource {

    constructor(private _url: string, private _apiErrorHandler: (err: ApiError) => void = null) {}

    async getRows(filter: DataTableFilter, filterAdapter: FilterAdapter, dataAdapter: PagedDataAdapter): Promise<PagedData | null> {
        const _http = globalThis.c('http')
        const _apiError = globalThis.c('api-error')
        try {
            return dataAdapter(await _http.post(this._url, filterAdapter(filter)))
        }
        catch (e) {
            _apiError.handle(e, this._apiErrorHandler)
            return null
        }
    }
}