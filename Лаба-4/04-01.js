const http = require('http');
const url = require("url");
const DB = require('./DB');

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
                        response.statusCode = 200;
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
                            response.statusCode = 200;
                            response.end();
                        } catch (error) {
                            console.log(error.message);
                            response.writeHead(404, { 'Content-Type': 'text/plain' });
                            response.end('Строка с указанным id не найдена');
                    }})
})
Db.on('DELETE', async (request, response) => {
    const rowId = url.parse(request.url, true).query.id;
                    try {
                        await Db.Delete(rowId);
                        response.statusCode = 200;
                        response.end();
                    } catch {
                        response.writeHead(404, { 'Content-Type': 'text/plain' });
                        response.end('Строка с указанным id не найдена');
                    }

})

http.createServer(
    (request, response) => {
        if (url.parse(request.url,true).pathname == '/api/db') {
            Db.eE.emit(request.method, request, response);
            }
            else {
                response.writeHead(404, { 'Content-Type': 'text/plain;charset=utf8' });
                response.end('Страница не найдена');
              }
        }
).listen(5000, () => {
    console.log("Server running at http://localhost:5000/")
});