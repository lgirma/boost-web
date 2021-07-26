import {LocalSessionStorageService} from "../src";
import { describe } from 'mocha';
import {GetMockAppService} from "./Mocks";
import {initDom} from "./DOM";
// @ts-ignore
const chai = require('chai');
const expect = chai.expect;

initDom()
const _sessionService = new LocalSessionStorageService(GetMockAppService('SessionTestApp'))

describe('LocalSessionStorageService tests', () => {

    it('Stores items properly', () => {
        _sessionService.setItem('lang', 'en')
        let stored = _sessionService.getItem('lang')
        expect(stored).to.equal('en')
    })

    it('Uses app name prefix', () => {
        _sessionService.setItem('lang', 'en')
        let stored = globalThis.localStorage.getItem('SessionTestApp_lang')
        expect(stored).to.equal('"en"')
    })

})