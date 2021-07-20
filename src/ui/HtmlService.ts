import {UIElement} from "./Common";

export interface HtmlService {
    attrs(options?: UIElement): Partial<HTMLElement>
    render(tag: keyof HTMLElementTagNameMap, content?: any, options?: UIElement): string
}