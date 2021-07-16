import {AppEvent} from "../src";
import { describe } from 'mocha';
// @ts-ignore
const chai = require('chai');
const expect = chai.expect;

describe('AppEvent tests', () => {

    it('Handles subscriptions properly', () => {
        const event = new AppEvent()
        let callBackCalled = false
        const callBack = function () { callBackCalled = true }
        event.subscribe(callBack)
        event.publish(0)
        expect(callBackCalled).to.equal(true)
    })

    it('Handles publishing properly', () => {
        const event = new AppEvent()
        let publishedData = null
        const callBack = function (d: any) { publishedData = d }
        event.subscribe(callBack)
        event.publish(0)
        expect(publishedData).to.equal(0)
    })

    it('Handles un-subscriptions properly', () => {
        const event = new AppEvent()
        let callBackCalled = false
        const callBack = function () { callBackCalled = true }
        event.subscribe(callBack)
        event.unsubscribe(callBack)
        event.publish(0)
        expect(callBackCalled).to.equal(false)
    })

})