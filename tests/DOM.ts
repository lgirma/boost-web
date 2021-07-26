import { JSDOM } from 'jsdom';

export function initDom() {
    const {window} = new JSDOM('<!doctype html><html><body></body></html>', {url: 'http://localhost'});
    globalThis.document = window.document;
    globalThis.window = global.document.defaultView;
    globalThis.localStorage = window.localStorage
}