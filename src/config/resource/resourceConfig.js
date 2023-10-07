import express from 'express';
import morgan from 'morgan';
import session from 'express-session';

import ejs from 'ejs';

import {env} from "#root/config/index.js";

import {fileURLToPath} from 'url';
import * as path from 'path';

const {JWT_SECRET} = env;

function resourceConfig(app) {
    app.engine('ejs', ejs.renderFile);
    app.set('views engine', 'ejs');
    app.set('views', path.join(path.dirname(fileURLToPath(import.meta.url)), '../../resource/views'));

//     set static files
    app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), '../../public')));

//     set body parser
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());

//     morgan logger
    app.use(morgan('combined'));

    return {
        status: '✅',
        message: 'Resource config loaded'
    }
}

export default resourceConfig;