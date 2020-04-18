const express = require('express');
const http = require('http');
const path = require('path');

let app = express();

/* Seteo directorio público */
app.use('/public', express.static('src/assets'));

/* build/ guarda la aplicación compilada que se envía al Cliente */
app.use(express.static(path.join(__dirname, 'build')));

const port = process.env.PORT || '8080';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost:${port}`));