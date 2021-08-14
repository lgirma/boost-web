import {SimpleSecurityService, SimpleConfigService, configFor, SecurityConfig} from "../src";
import { describe } from 'mocha';
import {
    GetLastNavPath,
    GetMockNavService, GetMockSessionStorageService, getUser
} from "./Mocks";
// @ts-ignore
const chai = require('chai');
const expect = chai.expect;

const _config = new SimpleConfigService({
    security: configFor<SecurityConfig>({
        Roles: ['ADMIN', 'GUEST', 'SUPERUSER'],
        AuthPageUrl: '/login',
        LogoutUrl: '/logout',
        UnauthorizedPageUrl: '/400',
        RoleBundles: {ADMIN: 'a', GUEST: 'g', SUPERUSER: 's'},
        UnsecureBundles: ['auth']
    })
})

const _nav = GetMockNavService()
const _session = GetMockSessionStorageService()
const _security = new SimpleSecurityService(_config, _session, GetMockNavService())
_nav.navTo('')


describe('SimpleAuthService tests', () => {

    it('Initializes properly', () => {
        _security.init()
        expect(GetLastNavPath()).to.equal('/login')
    })

    it('Navigation for roles works properly', () => {
        _security.gotoRoleHome(['ADMIN'])
        expect(GetLastNavPath()).to.equal('/a')
        _security.gotoRoleHome(['SUPERUSER'])
        expect(GetLastNavPath()).to.equal('/s')
    })

    it('Navigates to unauthorized page properly', () => {
        _security.gotoRoleHome(['INVALID_ROLE'])
        expect(GetLastNavPath()).to.equal('/400')
    })

    it('Sets current user properly', () => {
        _security.setUser(getUser('admin', 'Administrator', ['ADMIN', 'GUEST']))
        expect(GetLastNavPath()).to.equal('/a')
        const u = _session.getItem('user')
        expect(u.name).to.equal('admin')
    })

    it('Denies navigation to unauthorized page', () => {
        _security.gotoUrl('/s/reset-db')
        expect(GetLastNavPath()).to.equal('/a')
    })

})