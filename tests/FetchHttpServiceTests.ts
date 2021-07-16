import {configFor, FetchHttpService, HttpConfig} from "../src";
import { describe } from 'mocha';
import {GetMockConfigService} from "./Mocks";
import fetch from "node-fetch";
import {createAndStartApi, stopApi} from "./MockHttpApi";
// @ts-ignore
const chai = require('chai');
const expect = chai.expect;

global.fetch = fetch
const _http = new FetchHttpService(GetMockConfigService({
    http: configFor<HttpConfig>({
        apiBaseUrl: 'http://localhost:8484'
    })
}))

createAndStartApi((req, res) => {
    if (req.url.endsWith('notOk')) {
        res.writeHead(500)
        return ''
    } else if (req.url.endsWith('ping-post') && req.method == 'POST') {
        res.setHeader('Content-Type', 'application/json')
        return 'OK'
    } else if (req.url.endsWith('ping-get') && req.method == 'GET') {
        res.setHeader('Content-Type', 'plain/text')
        return 'OK'
    }
    return ''
})

describe('FetchHttpService tests', () => {

    it('Uses api url from config', async () => {
        let response = await _http.request('get', 'sample-get-request');
        expect(response.url).to.equal('http://localhost:8484/sample-get-request')
    })

    it('Uses http methods appropriately', async () => {
        let response = await _http.get('ping-get');
        expect(response).to.equal('OK')
    });

    it('Throws when server result is not 2xx OK', async () => {
        let error = null;
        try { await _http.get('notOk'); }
        catch (err) { error = err; }
        expect(error).to.not.be.null;
    });

    it('Calls post requests appropriately', async () => {
        const postResponse = await _http.post('create', {
            data: 1
        });
        expect(postResponse).to.deep.equal({data: 1})
    });

    // This should be the last test
    it('Throws when server is unreachable', async () => {
        stopApi()
        let error = null;
        try { await _http.get('notOk'); }
        catch (err) { error = err; }
        expect(error).to.not.be.null;
        expect(error?.code).to.equal('ECONNREFUSED')
    });

})