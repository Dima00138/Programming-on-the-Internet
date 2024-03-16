const http = require('http');
const fs = require('fs');


http.createServer(
    (request, response) => {
        if (request.url == '/html') {
            fs.readFile('Лаба-2/index.html', 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                response.writeHead(200, {
                    'Content-type' : 'text/html; charset=utf-8'});
                    response.end(data);
            })
        }
        else if (request.url == '/png' && request.method == 'GET') {
            fs.readFile('Лаба-2/pic.png', (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                response.writeHead(200, {
                    'Content-type' : 'image/png'});
                    response.end(data);
            })

        }
        else if (request.url == '/api/name' && request.method == 'GET') {
            response.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            response.end("Timoshenko Dmitry Valerievich");
            }
            else if (request.url == '/xmlhttprequest') {
                fs.readFile('Лаба-2/xmlhttprequest.html', 'utf8', (err, data) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    response.writeHead(200, {
                        'Content-type' : 'text/html; charset=utf-8'});
                        response.end(data);
                })
                }
                else if (request.url == '/fetch') {
                    fs.readFile('Лаба-2/fetch.html', 'utf8', (err, data) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        response.writeHead(200, {
                            'Content-type' : 'text/html; charset=utf-8'});
                            response.end(data);
                    })
                    }
                    else if (request.url == '/jquery') {
                        fs.readFile('Лаба-2/jquery.html', 'utf8', (err, data) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            response.writeHead(200, {
                                'Content-type' : 'text/html; charset=utf-8'});
                                response.end(data);
                        })
                        }
        else {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('Not Found');
          }
    }
).listen(3000, () => {
    console.log('Server is running on port 3000');
});