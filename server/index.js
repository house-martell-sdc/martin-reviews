require('newrelic');

const http = require('http');
const dotenv = require('dotenv');
const app = require('./app.js');

dotenv.config();

const server = http.createServer(app);
const PORT = process.env.PORT || 9001;

server.listen(PORT, () => { console.log('Listening on PORT: ', PORT); });
server.on('error', (err) => { console.error(err); });
