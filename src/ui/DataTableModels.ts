import {FormFieldType} from "./FormModels";
import {Dict} from "../common";
import {FilterAdapter, PagedDataAdapter, PagedDataSource} from "../data";

export interface DataTableConfig {
    filterAdapter?: FilterAdapter
    pagedDataAdapter?: PagedDataAdapter
}

export type DataTableOptionsFrom = Partial<DataTableOptions> &
    Omit<DataTableOptions, 'dataSource'> & { dataSource: PagedDataSource } &
    Omit<DataTableOptions, 'columns'> & { columns: Dict<Partial<DataTableColumn>> }

export interface DataTableOptions {
    columns: Dict<DataTableColumn>
    dataSource: PagedDataSource
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

export interface DataTablePagination {
    canGoFirst: boolean
    canGoPrev: boolean
    canGoNext: boolean
    canGoLast: boolean
}