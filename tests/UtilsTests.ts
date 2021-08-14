import { describe } from 'mocha';
// @ts-ignore
const chai = require('chai');
const expect = chai.expect;
import * as utils from '../src/common/Utils'

describe('Utils tests', () => {

    it('toArray works properly', () => {
        expect(utils.toArray(null)).to.deep.equal([])
        expect(utils.toArray(1)).to.deep.equal([1])
        expect(utils.toArray([1])).to.deep.equal([1])
    })

    it('deep merging works properly', () => {
        expect(utils.deepMerge({a:1, b:2}, {a: 2, c:3})).to.deep.equal({a:2, b:2, c:3})
        expect(utils.deepMerge({a:1, b:2, c:{x:1, y:1}}, {b:1, c:{y:2, z:0}}))
            .to.deep.equal({a:1, b:1, c:{x:1, y:2, z:0}})
    })

    it('deep merging works for functions', () => {
        const merged = utils.deepMerge(
            {a:1, b:2, c:{x:1, y:() => 1}},
            {b:1, c:{y:() => 2, z:0}})
        expect(merged.c.y()).to.deep.equal(2)
    })

    it('Year detection works', () => {
        expect(utils.isYear('500')).to.equal(false)
        expect(utils.isYear('3000')).to.equal(false)
        expect(utils.isYear('2020')).to.equal(true)
        expect(utils.isYear('1980')).to.equal(true)
    })

    it('Date detection works', () => {
        expect(utils.isDate('2012-01-02')).to.equal(true)
        expect(utils.isDate('3000-01-02')).to.equal(false)
        expect(utils.isDate('2012')).to.equal(false)
    })

    it('swapping key-value pairs works', () => {
        expect(utils.swapKeyValues({a: 1, b: 2, c: 3})).to.deep.equal({1: 'a', 2: 'b', 3: 'c'})
    })

})