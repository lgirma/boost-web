export class AppModule {
    private readonly _name: string
    private readonly _subModules: AppModule[]

    getName() {return this._name}
    getSubModules() {return this._subModules}

    constructor(name: string, subModules: AppModule[]) {
        this._name = name
        this._subModules = subModules
    }
}