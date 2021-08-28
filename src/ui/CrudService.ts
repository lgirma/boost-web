import {CrudConfig, CrudOptions, CrudOptionsFrom} from "./CrudModels";
import {ConfigService} from "../config";
import {HttpPagedDataSource} from "../data";
import {DataTableOptions} from "./DataTableModels";
import {deepMerge, StringUtils} from "../common";

export interface CrudService {
    createConfig(from: CrudOptionsFrom): Promise<CrudOptions>
}

export class CrudServiceImpl implements CrudService {
    private _config: CrudConfig

    async createConfig(from: CrudOptionsFrom): Promise<CrudOptions> {
        if (from == null || from.id == null)
            throw 'Crud: Source config and ID cannot be null'
        const id = from.id
        let dataTableOpts = (from.dataTable ?? {}) as DataTableOptions

        return {
            ...from,
            dataTable: deepMerge({
                dataSource: new HttpPagedDataSource(this._config.getListUrl(from.id)),
                commands: []
            } as any, dataTableOpts),
            createUrl: from.createUrl ?? this._config.getCreateUrl(id),
            exportUrl: from.exportUrl ?? this._config.getExportUrl(id),
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
            }, from.filterForm),
            detailForm: deepMerge(from.detailForm ?? from.updateForm ?? {}, {readonly: true})
        } as CrudOptions
    }

    constructor(config: ConfigService, private _str: StringUtils) {
        const initial = config.get<Partial<CrudConfig>>('crud') ?? {}
        this._config = config.get<CrudConfig>('crud', {
            idField: 'id',
            getCreateUrl: id => `${id}/create`,
            getDeleteUrl: (id, row) => `${id}/delete/${row[initial.idField ?? 'id']}`,
            getUpdateUrl: (id, _) => `${id}/update`,
            getDetailUrl: (id, params) => `${id}/detail/${params}`,
            getListUrl: id => `${id}/list`,
            getExportUrl: id => `${id}/export`,
            ...initial
        })
    }

}