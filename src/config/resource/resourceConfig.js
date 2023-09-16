import express from 'express';
import morgan from 'morgan';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function resourceConfig(app) {
//      set view engine
    app.set('views engine', 'ejs');
    app.set('views', path.join(__dirname, 'resources/views'));

//     set static files
    app.use(express.static(path.join(__dirname, 'public')));

//     set favicon
    app.use('/favicon.ico', express.static('./src/public/favicon.ico'));

//     set body parser
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

//     morgan logger
    app.use(morgan('combined'));
}

export default resourceConfig;