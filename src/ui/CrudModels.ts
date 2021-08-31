import {DataTableOptionsFrom} from "./DataTableModels";
import {PartialFormConfig} from "./FormModels";

export interface CrudConfig {
    idField?: string
    getListUrl?: (id: string) => string
    getExportUrl?: (id: string) => string
    getCreateUrl?: (id: string) => string
    getDetailUrl?: (id: string, params: string) => string
    getDeleteUrl?: (id: string, row: any) => string
    getUpdateUrl?: (id: string, row: any) => string
    getDeleteAllUrl?: (id: string) => string
}

export interface CrudOptionsFrom {
    id: string
    dataTable: Partial<DataTableOptionsFrom>

    // Form configs
    createForm?: PartialFormConfig
    updateForm?: PartialFormConfig
    detailForm?: PartialFormConfig
    filterForm?: PartialFormConfig

    // Methods
    getNew?: () => any
    getFilter?: () => any

    // Data sources
    detailUrl?: (params: string) => string
    updateUrl?: (row: any) => string
    deleteUrl?: (row: any) => string
    deleteAllUrl?: string
    createUrl?: string
    exportUrl?: string

    // Misc
    name?: string
    namePlural?: string

    // Constrains
    canCreate?: boolean
    canDelete?: boolean
    canUpdate?: boolean
}

export interface CrudOptions {
    dataTable: DataTableOptionsFrom
    createForm: PartialFormConfig
    updateForm: PartialFormConfig
    detailForm: PartialFormConfig
    filterForm: PartialFormConfig
    getNew: () => any
    getFilter: () => any
    detailUrl: (params: string) => string
    updateUrl: (row: any) => string
    deleteUrl: (row: any) => string
    deleteAllUrl: string
    createUrl: string
    exportUrl: string
    id: string
    name: string
    namePlural: string
    canCreate?: boolean
    canDelete?: boolean
    canUpdate?: boolean
}

export const enum CrudPages {
    LISTING, LIST, CREATE, CREATING, EDIT, UPDATING
}

export interface CrudState {
    options: CrudOptions
    currentPage: CrudPages
    updatedObj: any
    createdObj: any
    filterObj: any
}