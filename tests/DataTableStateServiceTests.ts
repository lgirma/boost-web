import {DataTableStateService, DefaultStringUtils, SimpleFormService, DataTableConfig, DataTableFilter} from "../src";
import {GetMock_i18nService, GetMockConfigService, GetMockDataSource, MockDataFilter, MockPagedData} from "./Mocks";
// @ts-ignore
const chai = require('chai');
const expect = chai.expect;

const _i18n = GetMock_i18nService({
    am: {NAME: 'ስም'}
}, 'am')
const _config = GetMockConfigService({
    data: {
        pagedDataAdapter: (from: MockPagedData) => ({
            items: from.data,
            pageCount: from.totalPages,
            totalCount: from.count
        }),
        filterAdapter: from => (<MockDataFilter>{
            page: from.currentPage,
            itemsPerPage: from.pageSize,
            sortInfo: from.sort.map(s => ({column: s.by, asc: !s.desc}))
        })
    }
})
const _dataSource = GetMockDataSource(Array(35).fill(0))
const _str = new DefaultStringUtils(_i18n)
const _form = new SimpleFormService(_str)
const _dataTable = new DataTableStateService(_form, _str, _config)

describe('DataTableStateService tests', () => {

    it('Uses appropriate paging and filter adapters', async () => {
        const opts = await _dataTable.getConfig({
            dataSource: _dataSource
        })
        const filter = _dataTable.getDefaultFilter()
        const data = await _dataTable.getData(opts, filter)

        expect(data.pageCount).to.equal(4)
        expect(data.totalCount).to.equal(35)
        expect(data.items.length).to.equal(filter.pageSize)
    })

    it('Sets up columns configuration properly', async () => {
        const opts = await _dataTable.getConfig({
            dataSource: GetMockDataSource([{name: '', age: 5}])
        })
        expect(opts.columns.name.id).to.equal('name')
        expect(opts.columns.name.header).to.equal('ስም')
        expect(opts.columns.name.type).to.equal('name')

        expect(opts.columns.age.id).to.equal('age')
        expect(opts.columns.age.type).to.equal('number')
        expect(opts.columns.age.header).to.equal('Age')
    })

    it('Generates pagination info properly', async () => {
        async function getPagination(_filter: Partial<DataTableFilter>) {
            const filter = {..._dataTable.getDefaultFilter(), ..._filter}
            const config = _config.get<DataTableConfig>('data')
            const data = await _dataSource.getRows(filter, config.filterAdapter, config.pagedDataAdapter)
            return _dataTable.getPagination(filter, data)
        }

        let pagination = await getPagination({})

        expect(pagination.canGoFirst).to.equal(false)
        expect(pagination.canGoPrev).to.equal(false)
        expect(pagination.canGoNext).to.equal(true)
        expect(pagination.canGoLast).to.equal(true)

        pagination = await getPagination({currentPage: 1})

        expect(pagination.canGoFirst).to.equal(true)
        expect(pagination.canGoPrev).to.equal(true)
        expect(pagination.canGoNext).to.equal(true)
        expect(pagination.canGoLast).to.equal(true)

        pagination = await getPagination({currentPage: 3})

        expect(pagination.canGoFirst).to.equal(true)
        expect(pagination.canGoPrev).to.equal(true)
        expect(pagination.canGoNext).to.equal(false)
        expect(pagination.canGoLast).to.equal(false)
    })

})