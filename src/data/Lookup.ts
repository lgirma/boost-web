import {Adapter} from "../common";

export interface LookupItem {
    key: any
    value: string
}

export type LookupAdapter = Adapter<LookupItem[]>