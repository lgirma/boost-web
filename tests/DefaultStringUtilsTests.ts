import {DefaultStringUtils} from "../src";
import {GetMock_i18nService} from "./Mocks";
// @ts-ignore
const chai = require('chai');
const expect = chai.expect;

const _i18n = GetMock_i18nService({
    am: {
        'GET_FILE_SIZE': 'የፋይል መጠን'
    }
}, 'am')
const _str = new DefaultStringUtils(_i18n)

describe('DefaultStringUtils tests', () => {

    it('Humanizes strings properly', () => {
        expect(_str.humanize('Gone')).to.equal('Gone');
        expect(_str.humanize('gone')).to.equal('Gone');
        expect(_str.humanize('goneWithIt')).to.equal('Gone With It');
        expect(_str.humanize('gone_with_it')).to.equal('Gone with it');
    })

    it('Does not change already humanized string', () => {
        expect(_str.humanize('Gone With It')).to.equal('Gone With It');
    })

    it('Humanizes i18n aware strings properly', () => {
        expect(_str.humanized_i18n('getFileSize')).to.equal('የፋይል መጠን');
        expect(_str.humanized_i18n('getFileSizes')).to.equal('Get File Sizes');
    })

    it('Friendly file sizes', () => {
        expect(_str.getFriendlyFileSize(1024)).to.equal('1 KB');
        expect(_str.getFriendlyFileSize(1024**2)).to.equal('1 MB');
    })

    it('Generates random hashes properly', () => {
        expect(_str.randomHash()).to.not.equal(_str.randomHash());
        expect(_str.randomHash()).to.not.equal(_str.randomHash());
    })

    it('Formats parameterized strings properly', () => {
        expect(_str.fmt('a{0}b{1}', '1', '2')).to.equal('a1b2');
        expect(_str.fmt('ab', '1', '2')).to.equal('ab');
    })

})