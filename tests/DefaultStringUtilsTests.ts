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
        //expect(_str.humanize('GONE_WITH_IT')).to.equal('Gone With It');
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

    it('Can escape html string to prevent xss', () => {
        expect(_str.xssSafe('<i></i>')).to.equal('&lt;i&gt;&lt;&#x2Fi&gt;');
    })

    it('Can escape part of an html template to prevent xss', () => {
        expect(_str.fmtHtml('a{0}b{1}', '<i></i>', '2')).to.equal('a&lt;i&gt;&lt;&#x2Fi&gt;b2');
    })

    it('Pads zeros properly', () => {
        expect(_str.padZeros(10, 4)).to.equal('0010');
        expect(_str.padZeros(5, 3)).to.equal('005');
        expect(_str.padZeros(325, 3)).to.equal('325');
        expect(_str.padZeros(45000, 3)).to.equal('45000');
    })

})