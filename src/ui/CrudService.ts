import {CrudConfig, CrudOptions, CrudOptionsFrom} from "./CrudModels";
import {ConfigService} from "../config";
import {HttpPagedDataSource} from "../data";
import {DataTableOptions} from "./DataTableModels";
import {deepMerge, StringUtils} from "../common";

export interface CrudService {
    /*goto(page: CrudPages, state: CrudState): Promise<CrudState>
    create(state: CrudState): Promise<CrudState>
    update(state: CrudState): Promise<CrudState>
    delete(state: CrudState): Promise<CrudState>*/
    createConfig(from: CrudOptionsFrom): Promise<CrudOptions>
}

export class CrudServiceImpl implements CrudService {
    private _config: CrudConfig
    /*create(state: CrudState): Promise<CrudState> {
        return Promise.resolve(undefined);
    }

    delete(state: CrudState): Promise<CrudState> {
        return Promise.resolve(undefined);
    }

    goto(page: CrudPages, state: CrudState): Promise<CrudState> {
        return Promise.resolve(undefined);
    }

    update(state: CrudState): Promise<CrudState> {
        return Promise.resolve(undefined);
    }*/

    async createConfig(from: CrudOptionsFrom): Promise<CrudOptions> {
        if (from == null || from.id == null)
            throw 'Crud: Source config and ID cannot be null'
        const id = from.id
        let dataTableOpts = (from.dataTable ?? {}) as DataTableOptions
        dataTableOpts.dataSource ??= new HttpPagedDataSource(this._config.getListUrl(from.id))

        return {
            ...from,
            dataTable: dataTableOpts,
            createUrl: from.createUrl ?? this._config.getCreateUrl(id),
            updateUrl: from.updateUrl ?? (r => this._config.getUpdateUrl(id, r)),
            deleteUrl: from.deleteUrl ?? (r => this._config.getDeleteUrl(id, r)),
            detailUrl: from.detailUrl ?? (r => this._config.getDetailUrl(id, r)),
            name: from.name ?? this._str.humanized_i18n(id),
            namePlural: from.namePlural ?? (this._str.humanized_i18n(id) + ' - ' + this._str.humanized_i18n('LIST')),
            filterForm: deepMerge({
                fieldsConfig: {
                    sort: {hidden: true},
                    pageSize: {hidden: true},
                    currentPage: {hidden: true}
                }
            }, from.filterForm)
        } as CrudOptions
    }

    constructor(config: ConfigService, private _str: StringUtils) {
        const initial = config.get<Partial<CrudConfig>>('crud') ?? {}
        this._config = config.get<CrudConfig>('crud', {
            idField: 'id',
            getCreateUrl: id => `${id}/create`,
            getDeleteUrl: (id, row) => `${id}/delete/${row[initial.idField ?? 'id']}`,
            getUpdateUrl: (id, row) => `${id}/update/${row[initial.idField ?? 'id']}`,
            getDetailUrl: (id, params) => `${id}/detail/${params}`,
            getListUrl: id => `${id}/list`,
            ...initial
        })
    }

}