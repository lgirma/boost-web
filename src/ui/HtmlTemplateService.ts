import {MessageType, Size, UIElement} from "./Common";
import {DeepPartial} from "../common";

export interface HtmlTemplate {
    theme?: UIElement
    attrs?: DeepPartial<HTMLElement>
    excludeAttrs?: any
}

export interface HtmlTemplateService {
    getAttrs(template: HtmlTemplate): DeepPartial<HTMLElement>
    render(tag: keyof HTMLElementTagNameMap, content?: any, options?: UIElement): string
}

export class WebHtmlTemplateService implements HtmlTemplateService {
    getAttrs(template: HtmlTemplate): DeepPartial<HTMLElement> {
        let {excludeAttrs, attrs, theme} = template
        let result: DeepPartial<HTMLElement> = {...this.getThemeAttrs(theme), ...attrs}
        excludeAttrs ??= {}
        for (const k in excludeAttrs) {
            delete result[k]
        }
        return result
    }

    getThemeAttrs(theme: UIElement): DeepPartial<HTMLElement> {
        theme = {
            message: MessageType.NONE,
            elevation: 0,
            opacity: 1,
            size: Size.MD,
            roundness: 0,
            ...theme
        }
        return {

        }
    }

    render(tag: keyof HTMLElementTagNameMap, template?: HtmlTemplate, content?: any): string {
        const attrs = this.getAttrs(template)
        const elt = globalThis.document.createElement(tag) as HTMLElement
        for (const a in attrs)
            elt.setAttribute(a, attrs[a])
        elt.innerHTML = content
        return elt.outerHTML
    }

}