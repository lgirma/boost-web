import {configFor, FetchHttpService, HttpConfig} from "../src";
import { describe } from 'mocha';
import {GetMockConfigService} from "./Mocks";
import fetch from "node-fetch";
import {createAndStartApi, stopApi} from "./MockHttpApi";
import {FormData} from 'formdata-node'
import formidable from 'formidable'
// @ts-ignore
const chai = require('chai');
const expect = chai.expect;

global.fetch = fetch
global.FormData = FormData as any
const _http = new FetchHttpService(GetMockConfigService({
    http: configFor<HttpConfig>({
        apiBaseUrl: 'http://localhost:8484'
    })
}))

let lastRequest: any = null
createAndStartApi(app => {
    app.get('/ping-get', (_, res) => {
        lastRequest = _
        res.header('Content-Type', 'plain/text')
        res.send('OK')
    })

    app.get('/notOK', (_, res) => {
        lastRequest = _
        res.status(500).send('500 Error')
    })

    app.post('/ping-post', (req, res) => {
        lastRequest = req
        res.header('Content-Type', 'application/json')
        res.send(req.body)
    })

    app.post('/post-form', (req, res) => {
        lastRequest = req
        res.header('Content-Type', 'application/json')

        const form = formidable({ multiples: true });
        form.parse(req, (_, fields) => {
            res.json(fields)
        });
    })

    app.get('/*', (_, res) => {
        lastRequest = _
        res.header('Content-Type', 'plain/text')
        res.send('Hello World!')
    })
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
        const postResponse = await _http.post('ping-post', {
            data: 1
        });
        expect(postResponse).to.deep.equal({data: 1})
    });

    it('Posts form data appropriately', async () => {
        const payload = new FormData()
        payload.set('data', 1)
        const postResponse = await _http.post('post-form', payload)
        expect(lastRequest.header('Content-Type')).to.equal('multipart/form-data')
        expect(postResponse).to.deep.equal({data: "1"})
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