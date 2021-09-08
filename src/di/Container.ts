import {AppEvent} from "../events";

type ContainerFunc<P> = <N extends keyof P>(n: N) => P[N];

interface InjectionInfo<T, P extends keyof T> {
    factory: (c: any) => T[P]
    lazy: boolean
}

export const onContainerInit = new AppEvent()

export class ContainerBuilder<T extends { [P in keyof T]: any }> {
    public constructor(private provider: { [P in keyof T]: InjectionInfo<T, P> } = {} as any) {

    }
    public add<K extends string, V>(name: K, p: (c: ContainerFunc<T>) => V, lazy = true): ContainerBuilder<T & { [P in K]: V }> {
        this.provider[name as any] = {factory: p, lazy};
        return this as any;
    }

    finish() : ContainerFunc<{ [P in keyof T]: T[P]}> {
        const provider = this.provider;
        const cache: { [name in keyof T]?: any } = {};
        const container = function<K extends keyof T>(name: K) : T[K]  {
            if (!cache[name]) {
                const resolved = provider[name]
                if (resolved == null)
                    throw `Unresolved dependency: ${name}`
                cache[name] = resolved.factory(container);
            }
            return cache[name] as any;
        }
        for (const k in provider) {
            if (!provider[k].lazy)
                cache[k] = provider[k].factory(container)
        }
        onContainerInit.publish(container)
        return container as any;

    }
}

export function Container() {
    return new ContainerBuilder()
}