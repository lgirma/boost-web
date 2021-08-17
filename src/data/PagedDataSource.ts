import {Adapter} from "../common";
import {ApiError} from "../http";

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

export type FilterAdapter = Adapter<any, DataTableFilter>
export type PagedDataAdapter = Adapter<PagedData, any>

export interface PagedDataSource {
    getRows(filter: DataTableFilter, filterAdapter: FilterAdapter, dataAdapter: PagedDataAdapter): Promise<PagedData>
}

export class ConstPagedDataSource implements PagedDataSource {
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

export class HttpPagedDataSource implements PagedDataSource {

    constructor(private _url: string, private _apiErrorHandler: (err: ApiError) => void = null) {}

    async getRows(filter: DataTableFilter, filterAdapter: FilterAdapter, dataAdapter: PagedDataAdapter): Promise<PagedData | null> {
        const _http = globalThis.c('http')
        const _apiError = globalThis.c('api-error')
        try {
            return dataAdapter(await _http.post(this._url, filterAdapter(filter)))
        }
        catch (e) {
            _apiError.handle(e, this._apiErrorHandler)
            throw e
        }
    }
}