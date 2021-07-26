export interface PageResourcesService {
    addResource(id: string, content: string)
}

export class WebPageResourcesService implements PageResourcesService {
    private readonly _containerElement: HTMLElement

    addResource(id: string, content: string) {
        const elt = globalThis.document.createElement('div')
        elt.id = id
        elt.innerHTML = content
        this._containerElement.appendChild(elt)
    }

    constructor(containerElement?: HTMLElement) {
        if (containerElement == null) {
            containerElement = globalThis.document.createElement('div')
            containerElement.id = 'resourcesRoot'
            document.body.appendChild(containerElement)
        }
        this._containerElement = containerElement
    }
}