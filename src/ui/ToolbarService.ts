export interface ToolbarAction {
    condition(onItems: any[]): boolean
    invoke(onItems: any[])
    id: string
    label: string
    iconKey: string
    iconType: string
    confirm: boolean
}

export type ToolbarActionFrom = Partial<ToolbarAction>