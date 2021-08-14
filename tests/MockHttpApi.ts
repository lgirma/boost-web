import express from 'express'
import type {Express} from "express";

let app: Express
let server: any

export function createAndStartApi(routes: (app: Express) => void) {
    app = express();
    const port = 8484;
    app.use(express.json());
    app.use(express.text());
    app.use(express.urlencoded( {extended: true} ));

    routes(app)

    server = app.listen(port, () => {
        console.log(`Example app running on http://localhost:${port}!`)
    });
}

export function stopApi() {
    server?.close()
}