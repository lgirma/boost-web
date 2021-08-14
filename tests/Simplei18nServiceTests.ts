import {configFor, i18nConfig, Simplei18nService} from "../src";
import { describe } from 'mocha';
import {GetMockConfigService, GetMockSessionStorageService} from "./Mocks";
// @ts-ignore
const chai = require('chai');
const expect = chai.expect;

const _config = GetMockConfigService({
    i18n: configFor<i18nConfig>({
        defaultLocale: 'en-GB',
        translations: {
            'en-GB': {
                'CANCEL': 'Cancel',
                'OK': 'Ok',
                'TRAVEL': 'Travel from {0} to {1}'
            }
        }
    })
})
const _i18n = new Simplei18nService(_config, GetMockSessionStorageService())

describe('Simplei18nService tests', () => {

    it('Uses default translations properly', () => {
        expect(_i18n._('OK')).to.equal('Ok')
    })

    it('Falls back properly', () => {
        expect(_i18n._('OK2')).to.equal('OK2')
    })

    it('Matches exact properly', () => {
        expect(_i18n.exact('OK')).to.equal('Ok')
        expect(_i18n.exact('OK2')).to.equal(undefined)
    })

    it('Returns parameterized keys properly', () => {
        expect(_i18n._('TRAVEL', 'A', 'B')).to.equal('Travel from A to B')
    })

    it('Adds new translations properly', () => {
        _i18n.addTranslations({
            'fr': {
                'CANCEL': "Annuler"
            }
        })
        expect(_i18n._('CANCEL')).to.equal('Cancel')
        _i18n.changeLanguage('fr')
        expect(_i18n._('CANCEL')).to.equal('Annuler')
        _i18n.changeLanguage('en-GB')
        expect(_i18n._('CANCEL')).to.equal('Cancel')
    })

    it('Merges new translations with existing ones properly', () => {
        _i18n.addTranslations({
            'en-GB': {
                'ACCEPT': 'Accept'
            }
        })
        expect(_i18n._('ACCEPT')).to.equal('Accept')
        expect(_i18n._('OK')).to.equal('Ok')
    })

    it('Handles non-existing language properly', () => {
        _i18n.changeLanguage('am-ET')
        expect(_i18n._('ACCEPT')).to.equal('ACCEPT')
        _i18n.changeLanguage('en-GB')
    })

})