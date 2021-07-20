import {UIElement} from "./Common";

export interface ButtonOptions extends UIElement, Partial<HTMLButtonElement> {

}

export interface ButtonService {
    /**
     * Returns html attributes for a button with the given options.
     * @param options
     */
    attrs(options?: ButtonOptions): HTMLButtonElement
    render(content: any, options?: ButtonOptions): string
}