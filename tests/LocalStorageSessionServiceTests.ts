import {LocalSessionStorageService} from "../src";
import { describe } from 'mocha';
import {initDom} from "./DOM";
// @ts-ignore
const chai = require('chai');
const expect = chai.expect;

initDom()
const _sessionService = new LocalSessionStorageService()

describe('LocalSessionStorageService tests', () => {

    it('Stores items properly', () => {
        _sessionService.setItem('lang', 'en')
        let stored = _sessionService.getItem('lang')
        expect(stored).to.equal('en')
    })

})