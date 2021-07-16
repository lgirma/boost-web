import {createServer, IncomingMessage, Server, ServerResponse} from "http";

let server: Server

export function createAndStartApi(urlToResponseMap?: (req: IncomingMessage, res: ServerResponse) => string | undefined) {
    server = createServer(function (req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Content-Type', 'application/json');
        if ( req.method === 'OPTIONS' ) {
            res.writeHead(200);
            res.end();
            return;
        }
        let response = urlToResponseMap != null ? (urlToResponseMap(req, res) ?? '') : ''
        res.write(response); //write a response to the client
        res.end(); //end the response
    });
    server.listen(8484);
}

export function stopApi() {
    server.close()
}