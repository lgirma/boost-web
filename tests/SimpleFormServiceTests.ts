
import {DefaultStringUtils, SimpleFormService, Container} from "../src";
import {GetMock_i18nService} from "./Mocks";

const chai = require('chai');
const expect = chai.expect;

globalThis.c = Container()
    .add('i18n', () => GetMock_i18nService({
        'am': {
            'INTERNATIONAL_NAME': 'ስም',
            'M': 'ወ',
            'SECOND_KEY': 'ሁለተኛው ቍልፍ'
        }
    }, 'am'))
    .add('string-utils', c => new DefaultStringUtils(c('i18n')))
    .add('form', c => new SimpleFormService(c('string-utils')))
    .finish()

const _form = globalThis.c('form') as SimpleFormService

describe('Form service tests', () => {

    it('Guesses types correctly', () => {
        expect(_form.guessType('password', null)).to.equal('password');
        expect(_form.guessType('a', 1)).to.equal('number');
        expect(_form.guessType('b', 'a')).to.equal('text');
        expect(_form.guessType('b', null)).to.equal('text');
        expect(_form.guessType('b', true)).to.equal('checkbox');
        expect(_form.guessType('email', '')).to.equal('email');
    });

    it('Sets up field choices correctly', () => {
        let config = _form.createFormConfig({}, {
            fieldsConfig: {
                f1: { type: "radio", choices: ['alpha', 'beta'] },
                f2: { type: "radio", choices: {KEY1: 'firstKey', KEY2: 'SECOND_KEY'} },
                f3: { type: "radio", choices: [{key: 1, val: 'M'}, {key: 2, val: 'F'}] },
            }
        })
        expect(config.fieldsConfig.f1.choices).to.deep.equal(
            [{key: 'alpha', val: 'Alpha'}, {key: 'beta', val: 'Beta'}]);
        expect(config.fieldsConfig.f2.choices).to.deep.equal(
            [{key: 'KEY1', val: 'First Key'}, {key: 'KEY2', val: 'ሁለተኛው ቍልፍ'}]);
        expect(config.fieldsConfig.f3.choices).to.deep.equal(
            [{key: 1, val: 'ወ'}, {key: 2, val: 'F'}]);
    });

    it('Sets up formConfig config properly', () => {
        let forObject = {userName: '', password: '', rememberMe: false, agreeToTerms: false};
        let config = _form.createFormConfig(forObject, {
            hideLabels: true,
            fieldsConfig: {
                agreeToTerms: {
                    label: "I agree to terms",
                    hideLabel: false
                }
            }
        })
        expect(config.fieldsConfig['userName'].label).to.equal('User Name');
        expect(config.fieldsConfig['userName'].id).to.equal('userName');
        expect(config.fieldsConfig['userName'].hideLabel).to.equal(true);
        expect(config.fieldsConfig['password'].label).to.equal('Password');
        expect(config.fieldsConfig['password'].id).to.equal('password');
        expect(config.fieldsConfig['rememberMe'].label).to.equal('Remember Me');
        expect(config.fieldsConfig['rememberMe'].id).to.equal('rememberMe');
        expect(config.fieldsConfig['agreeToTerms'].label).to.equal('I agree to terms');
        expect(config.fieldsConfig['agreeToTerms'].id).to.equal('agreeToTerms');
        expect(config.fieldsConfig['agreeToTerms'].hideLabel).to.equal(false);
    });

    it('Validates forms sync correctly', () => {
        let forObject = {userName: '', age: 17, email: 'abe@example.com', city: ''};
        let config = _form.createFormConfig(forObject, {
            hideLabels: true,
            fieldsConfig: {
                userName: {required: true},
                email: {required: true},
                age: {validate: val => (val > 18 ? '' : 'AGE_18_OR_ABOVE')}
            }
        });
        let validationResult = _form.validate(forObject, config);

        expect(validationResult.hasError).to.be.true;
        expect(validationResult.fields.city.hasError).to.be.false;
        expect(validationResult.fields.age.hasError).to.be.true;
        expect(validationResult.fields.age.message).to.equal('AGE_18_OR_ABOVE');
        expect(validationResult.fields.email.hasError).to.be.false;
    });

    it('Does formConfig-level sync validation', () => {
        let registration = {userName: '', password: 'a', confirmPassword: 'b'};
        let formConfig = _form.createFormConfig(registration, {
            validate: [
                form => (form.password != form.confirmPassword ? 'PASSWORDS_DONT_MATCH' : ''),
                form => (form.userName == form.password ? {password: 'USERNAME_USED_AS_PASSWORD'} as any : {})
            ]
        });
        let validationResult = _form.validate(registration, formConfig);
        expect(validationResult.hasError).to.be.true;
        expect(validationResult.message).to.equal('PASSWORDS_DONT_MATCH');
    });

    it('Respects user config choices', () => {
        let registration = {userName: '', password: 'a', confirmPassword: 'b'};
        let formConfig = _form.createFormConfig(registration, {
            readonly: true, id: 'ab',
            fieldsConfig: {
                userName: {label: 'User ID', placeholder: 'Your unique name', readonly: false}
            }
        });
        let formConfig2 = _form.createFormConfig(registration, formConfig as any);

        expect(JSON.stringify(formConfig)).to.equal(JSON.stringify(formConfig2));
    })

    it('Uses i18n friendly labels', () => {
        let registration = {internationalName: ''};
        let formConfig = _form.createFormConfig(registration);

        expect(formConfig.fieldsConfig.internationalName.label).to.equal('ስም');
    })

});