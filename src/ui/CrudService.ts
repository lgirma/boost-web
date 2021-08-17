import {DataTableOptionsFrom} from "./DataTableModels";
import {PartialFormConfig} from "./FormModels";
import {DataSource} from "../data";

export interface CrudOptionsFrom {
    dataTable: DataTableOptionsFrom

    // Form configs
    createForm?: PartialFormConfig
    updateForm?: PartialFormConfig
    filterForm?: PartialFormConfig

    // Methods
    getNew?: () => any
    getFilter?: () => any

    // Data sources
    detailSource?: DataSource
    updateUrl?: string
    createUrl?: string

    // Misc
    id: string
    name?: string
    namePlural?: string
}

export interface CrudOptions {
    dataTable: DataTableOptionsFrom
    createForm: PartialFormConfig
    updateForm: PartialFormConfig
    filterForm: PartialFormConfig
    getNew: () => any
    getFilter: () => any
    detailSource: DataSource
    updateUrl: string
    createUrl: string
    id: string
    name: string
    namePlural: string
}

export const enum CrudPages {
    NONE, LIST, CREATE, EDIT
}

export interface CrudState {
    options: CrudOptions
    currentPage: CrudPages
    updatedObj: any
    createdObj: any
    filterObj: any
}

export interface CrudService {
    goto(page: CrudPages)
    create(): Promise<any>
    update(): Promise<any>
    createConfig(from: CrudOptionsFrom): CrudOptions
}