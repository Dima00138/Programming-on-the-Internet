const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === "/chat") {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(fs.readFileSync(__dirname +'\\index.html', 'utf8'));
    } else {
        res.writeHead(400, {'Content-Type': 'text/html; charset=utf-8'});
        res.end('400');
    }
});

server.listen(3000, () => console.log('Server is running at PORT 4000'));

const wss = new WebSocket.Server({ port: 4000, host: 'localhost', path: '/wsserver'});

wss.binaryType = "arraybuffer"

wss.on('connection', ws => {
    ws.binaryType = "arraybuffer"

    ws.on('message', message => {

        console.log('Received: %s', message);
    
        wss.clients.forEach(client => {
                client.send(message);
        });

    });
    
    ws.on('close', () => {

        // wss.clients.forEach(client => {
        //     client.send('Пользователь покинул чат')
        // })
    })
});