import {SimpleConfigService} from "../src";
import { describe } from 'mocha';
// @ts-ignore
const chai = require('chai');
const expect = chai.expect;

const _config = new SimpleConfigService({
    http: { timeout: 5 }
})

describe('SimpleConfigService tests', () => {

    it('Sets up initial config properly', () => {
        expect(_config.get('http').timeout).to.equal(5)
    })

    it('Merges default config with existing properly', () => {
        let httpConfig = _config.get('http', {baseUrl: 'https://example.com'}) as any
        expect(httpConfig.timeout).to.equal(5)
        expect(httpConfig.baseUrl).to.equal('https://example.com')
    })

})