import express from 'express';
function resourceConfig(app) {
//      set view engine
    app.set('views engine', 'ejs');
    app.set('views', './src/views');

//     set static files
    app.use(express.static('./src/public'));

//     set favicon
    app.use('/favicon.ico', express.static('./src/public/favicon.ico'));

//     set body parser
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
}

export default resourceConfig;