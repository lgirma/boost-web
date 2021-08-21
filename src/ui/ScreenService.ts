export const enum Size {
    MOBILE, TAB, DESKTOP
}

export interface ScreenService {
    getType(): Size
}

export class ScreenServiceImpl implements ScreenService {
    getType(): Size {
        const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        if (w < 768)
            return Size.MOBILE
        if (w < 992)
            return Size.TAB
        return Size.DESKTOP
    }

}