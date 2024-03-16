const http = require('http');
const fs = require('fs');
const url = require('url');
//const send = require('./module/m06_TDV');
const send = require('tdv-module-lab5');

let server = http.createServer((req, resp) =>{
    resp.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
    
    if (url.parse(req.url).pathname == '/' && req.method == 'GET')
    {
        resp.end(fs.readFileSync('index.html'));
    }

    else if (url.parse(req.url).pathname == '/' && req.method == 'POST'){
        console.log('POST');
        req.on('data', chunk => {
            
            let param = JSON.parse(chunk);

            send(param.sender, param.password, param.reciver, param.message);
        });
        req.on('end', () => {
            resp.end(`OK`);
        });
    }
    else 
        resp.end('Not Found');
})

server.listen(5000);
console.log('Server Started');













//jroc veut ywll blaw