require('dotenv').config({
    silent: true
});

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const http = require('http');
const moment = require('moment-timezone');
moment.tz.setDefault('UTC'); // set default time zone
const serialize = require('serialize-javascript');

app.use('/public', express.static(path.join(__dirname, 'public')));

let renderer;

if (process.env.NODE_ENV === 'production') {
    let bundle = fs.readFileSync('./dist/node.bundle.js', 'utf8');
    renderer = require('vue-server-renderer').createBundleRenderer(bundle);
    app.use('/dist', express.static(path.join(__dirname, 'dist'))); // make dist folder available
}

let events = [{
        description: 'Random Event 1',
        date: moment('2018-08-06', 'YYYY-MM-DD')
    },
    {
        description: 'Random Event 2',
        date: moment('2018-08-15', 'YYYY-MM-DD')
    },
    {
        description: 'Random Event 3',
        date: moment('2018-09-14', 'YYYY-MM-DD')
    }
];

app.get('/', (req, res) => {
    let template = fs.readFileSync(path.resolve('./index.html'), 'utf-8');
    let contentMarker = '<!-- APP -->';
    if (renderer) {
        // allows to pass context object (first arg)
        // passes events down to node.entry which can then use it to create
        // Vue instance
        renderer.renderToString({ events }, (err, html) => {
            if (err) {
                console.log(err);
            } else {
                res.send(template.replace(contentMarker,
                    // serialize turns object into string
                    `<script>var __INITIAL_STATE__ = ${serialize(events)}</script>\n${html}`));
            }
        });
    } else {
        res.send('<p>Awaiting compilation...</p><script src="/reload/reload.js"></script>');
    }
});

app.use(require('body-parser').json());
app.post('/add_event', (req, res) => {
    events.push({
        description: req.body.description,
        date: moment(req.body.date)
    });
    res.sendStatus(200);
})

const server = http.createServer(app);

if (process.env.NODE_ENV === 'development') {
    const reload = require('reload');
    const reloadServer = reload(server, app);
    require('./webpack-dev-middleware').init(app);
    require('./webpack-server-compiler').init(function(bundle) {
        let needsReload = (renderer === undefined);
        // provided by Vue
        // takes Vue instance and outputs correct server version of rendered app
        renderer = require('vue-server-renderer').createBundleRenderer(bundle);
        if (needsReload) {
            reloadServer.reload();
        }
    });
}

server.listen(process.env.PORT, function() {
    console.log(`Example app listening on port ${process.env.PORT}!`);
    if (process.env.NODE_ENV === 'development') {
        require("open")(`http://localhost:${process.env.PORT}`);
    }
});
