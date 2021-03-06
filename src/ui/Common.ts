export const enum ScreenPosition {
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
    CENTER
}

export const enum MessageType {
    NONE,
    SUCCESS,
    ERROR,
    WARNING,
    INFO
}

export const enum Size {
    MD, XS, SM, LG, XL
}

export const enum MaterialType {
    /**
     * Emphasis on the foreground/text. Message is reflected/communicated through the content.
     */
    REGULAR,
    /**
     * Emphasis on the background. Message is reflected/communicated through the background.
     */
    SOLID,
    /**
     * Emphasis on the border and foreground. Message is reflected/communicated through the border and content.
     */
    OUTLINED
}

export const enum Temperature {
    WARM,
    COLD
}

export const enum LightingType {
    LIGHT,
    WHITE,
    DARK,
    BLACK
}

export interface Themeable {
    message?: MessageType
    lighting?: LightingType
    material?: MaterialType,
    temperature?: Temperature,
    size?: Size
}

export interface UIElement extends Themeable {
    /**
     * Defaults to 0. In the scale of 0 (sharp rectangle) to 1 (perfect circle)
     */
    roundness?: number
    /**
     * Defaults to 1. In the scale of 0 (transparent) to 1 (opaque)
     */
    opacity?: number
    /**
     * Defaults to 0. Using shadow to create an illusion of elevation.
     */
    elevation?: number
}

export const Messagei18nKeys = {
    [MessageType.NONE]: 'INFO',
    [MessageType.INFO]: 'INFO',
    [MessageType.SUCCESS]: 'SUCCESS',
    [MessageType.ERROR]: 'ERROR',
    [MessageType.WARNING]: 'WARNING',
}