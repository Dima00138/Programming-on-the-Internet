const http = require('http');
const url = require("url");
const DB = require('./DB');
const { readFileSync } = require('fs');

const Db = DB();

Db.on('GET', async (request, response) => {
    response.writeHead(200, {
        'Content-type' : 'application/json'});
        response.end(await Db.Select());
})
Db.on('POST', async (request, response) => {
                    let body = "";
                    request.on('data', (chunk) => {
                        body += chunk;
                        })

                    request.on('end', async () => {
                        const newRow = JSON.parse(body);
                        await Db.Insert(newRow);
                        response.end();
                    })
})
Db.on('PUT', async (request, response) => {
    let body = "";

    request.on('data', (chunk) => {
        body += chunk;
    })

    request.on('end', async () => {
        const updRow = JSON.parse(body);
        try {
            await Db.Update(updRow);
            response.end();
        } catch (error) {
            console.log(error.message);
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('Строка с указанным id не найдена');
        }
    })
})
Db.on('DELETE', async (request, response) => {
    let body = "";

    request.on('data', (chunk) => {
        body += chunk;
    })

    request.on('end', async () => {
        try {
            await Db.Delete(+body);
            response.end();
        } catch (error) {
            console.log(error.message);
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('Строка с указанным id не найдена');
        }
    })
})

http.createServer(
    (request, response) => {
        if (url.parse(request.url,true).pathname == '/api/db') {
            Db.eE.emit(request.method, request, response);
        }
        else if (url.parse(request.url, true).pathname == '/') {
            let html = readFileSync("./Лаба-4/04-02.html");
            response.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            response.end(html);
        }
            else {
                response.writeHead(404, { 'Content-Type': 'text/plain;charset=utf8' });
                response.end('Страница не найдена');
              }
        }
).listen(5000, () => {
    console.log("Server running at http://localhost:5000/")
});