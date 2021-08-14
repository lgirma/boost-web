import {configFor, FetchHttpService, HttpConfig, HttpErrorType, HttpError} from "../src";
import { describe } from 'mocha';
import {GetMockConfigService} from "./Mocks";
import fetch from "node-fetch";
import {createAndStartApi, stopApi} from "./MockHttpApi";
import FormData from 'form-data'
import multer from 'multer'
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

const upload = multer()
createAndStartApi(app => {
    app.get('/ping-get', (_, res) => {
        res.header('Content-Type', 'text/plain')
        res.send('OK')
    })

    app.get('/notOK_5XX', (_, res) => {
        res.header('Content-Type', 'text/plain')
        res.status(500).send('INTERNAL_SERVER_ERROR')
    })

    app.get('/notOK_404', (_, res) => {
        res.header('Content-Type', 'text/plain')
        res.status(404).send('404_NOT_FOUND')
    })

    app.post('/ping-post', (req, res) => {
        res.header('Content-Type', 'application/json')
        res.send(req.body)
    })

    app.post('/ping-text', (req, res) => {
        res.header('Content-Type', 'text/plain')
        res.send(req.body)
    })

    app.post('/post-form', upload.none(), (req, res) => {
        res.header('Content-Type', 'application/json')
        res.send(req.body)
        res.status(200)
    })

    app.get('/*', (_, res) => {
        res.header('Content-Type', 'text/plain')
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

    it('Throws appropriate error on 5xx errors', async () => {
        let error: HttpError = null;
        try { await _http.get('notOk_5XX'); }
        catch (err) { error = err; }
        expect(error).to.not.be.null;
        expect(error.status).to.equal(500);
        expect(error.type).to.equal(HttpErrorType.ERR_5XX)
        expect(error.body).to.equal('INTERNAL_SERVER_ERROR')
    });

    it('Throws appropriate error on 404 errors', async () => {
        let error: HttpError = null;
        try { await _http.get('notOk_404'); }
        catch (err) { error = err; }
        expect(error).to.not.be.null;
        expect(error.status).to.equal(404);
        expect(error.type).to.equal(HttpErrorType.ERR_404)
        expect(error.body).to.equal('404_NOT_FOUND')
    });

    it('Calls post requests appropriately', async () => {
        const postResponse = await _http.post('ping-post', {
            data: 1
        });
        expect(postResponse).to.deep.equal({data: 1})
    });

    it('Posts UTF-8 data appropriately', async () => {
        const postResponse = await _http.post('ping-post', {
            data: 'ሀ'
        });
        expect(postResponse).to.deep.equal({data: 'ሀ'})
    });

    it('Reads text body appropriately', async () => {
        const postResponse = await _http.post('ping-text', 'Hello, World!', {
            headers: {'Content-Type': 'text/plain'}
        });
        expect(postResponse).to.equal('Hello, World!')
    });

    /*it('Posts form data appropriately', async () => {
        const payload = new FormData()
        payload.append('data', 1)
        const postResponse = await _http.post('post-form', payload)
        expect(postResponse).to.deep.equal({data: "1"})
    });*/

    // This should be the last test
    it('Throws when server is unreachable', async () => {
        stopApi()
        let error: HttpError = null;
        try { await _http.get('notOk'); }
        catch (err) { error = err; }
        expect(error).to.not.be.null;
        expect(error?.type).to.equal(HttpErrorType.NO_CONNECTION)
    });

})