import {HttpResponseBodyType} from "./HttpService";

export async function tryReadBody(response: Response, type: HttpResponseBodyType = HttpResponseBodyType.AUTO): Promise<any> {
    try {
        const mime = response.headers['Content-Type']
        if (type == HttpResponseBodyType.AUTO && mime != null) {
            if (mime.indexOf('application/json') > -1)
                type = HttpResponseBodyType.JSON
            else if (mime.indexOf('text/') > -1)
                type = HttpResponseBodyType.TEXT
            else if (mime.indexOf('multipart/form-data') > -1)
                type = HttpResponseBodyType.FORM_DATA
        }
        if (type == HttpResponseBodyType.TEXT)
            return await response.text()
        else if (type == HttpResponseBodyType.JSON)
            return await response.json()
        else if (type == HttpResponseBodyType.BLOB)
            return await response.blob()
        else if (type == HttpResponseBodyType.ARRAY_BUFFER)
            return await response.arrayBuffer()
        else if (type == HttpResponseBodyType.FORM_DATA)
            return await response.formData()
        else {
            const text = await response.text()
            if (text == null) return null
            try {return JSON.parse(text)}
            catch {return text}
        }
    }
    catch {}
    return null
}