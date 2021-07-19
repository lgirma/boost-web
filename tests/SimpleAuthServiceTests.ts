import {SimpleAuthService, SimpleConfigService, AuthConfig, configFor} from "../src";
import { describe } from 'mocha';
import {
    ApiError,
    GetLastMockHttpCall, GetLastNavPath,
    GetMockHttpService,
    GetMockNavService,
    GetMockSecurityService,
    getUser
} from "./Mocks";
// @ts-ignore
const chai = require('chai');
const expect = chai.expect;

const _config = new SimpleConfigService({
    auth: configFor<AuthConfig>({
        LoginApiUrl: 'auth-api/login',
        PasswordFieldName: 'secret',
        UserIdFieldName: 'userID'
    })
})

const _http = GetMockHttpService((_, body) => {
    if (body.userID == 'admin' && body.secret == 'admin') {
        return getUser('admin', 'Administrator', ['ADMIN', 'USER'])
    } else {
        throw ApiError(400, {code: 'AUTH_FAIL'})
    }
})

const _security = GetMockSecurityService()

const _auth = new SimpleAuthService(_config, _security, _http, GetMockNavService())

describe('SimpleAuthService tests', () => {

    it('Uses appropriate auth fields from config', async () => {
        await _auth.login({password: 'admin', userId: 'admin'})
        const req = GetLastMockHttpCall()
        expect(req.url).to.equal('auth-api/login')
        expect(req.body.userID).to.equal('admin')
        expect(req.body.secret).to.equal('admin')
    })

    it('Logs in appropriately', async () => {
        await _auth.login({password: 'admin', userId: 'admin'})
        expect(_security.getCurrentUser().getName()).to.equal('admin')
    })

    it('Logs out appropriately', async () => {
        await _auth.login({password: 'admin', userId: 'admin'})
        _auth.logout()
        expect(GetLastNavPath()).to.equal('/')
        expect(_security.getCurrentUser()).to.be.null
    })

})