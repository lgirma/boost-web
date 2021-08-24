import {HttpMethod, HttpService} from "../http";
import {ConfigService} from "../config";

export interface FileService {
    download(url: string, body?: any): Promise<any>
    loadFile(id: string): Promise<any>
}

export interface FileConfig {
    path?: string
}

function blobToBase64(blob): Promise<string | ArrayBuffer> {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
    })
}

export class FileServiceImpl implements FileService {
    private _config: FileConfig

    async download(url: string, body?: any, config?: RequestInit): Promise<any> {
        const res = await this._http.request((config?.method as HttpMethod) ?? (body == null ? 'get' : 'post'), url, body)
        const contentDisp = res.headers.get("Content-Disposition")
        if (contentDisp == null)
            throw "Empty content disposition"
        const fileName = contentDisp.split('filename=')[1].split(';')[0].trim();
        const blob = await res.blob()
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.setAttribute("download", fileName);
        a.click();
        return false;
    }

    async loadFile(id: string): Promise<any> {
        const res = await this._http.request('get', `${this._config.path}/get/${id}`)
        const blob = await res.blob()
        return await blobToBase64(blob)
    }

    constructor(private _http: HttpService, config: ConfigService) {
        this._config = config.get('file', {
            path: 'files'
        })
    }

}