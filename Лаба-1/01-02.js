const http = require('http');

let h = r => {
    let rc = '';
    for (key in r.headers) rc += '<h3>' + key + ':' + r.headers[key] + '</h3>';
    return rc;
}

http.createServer(
    (request, repsonse) => {
        let b = '';
        request.on('data', str => 
        {
            b += str; 
            console.log('data', b)
        });
        repsonse.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        request.on('end', () => repsonse.end(
            '<!DOCTYPE html><html><head></head>' +
            '<body>' +
            '<h1>Структура запроса</h1>' +
            '<h2>' + 'метод:        ' + request.method + '</h2>' +
            '<h2>' + 'uri:          ' + request.url + '</h2>' +
            '<h2>' + 'version:      ' + request.httpVersion + '</h2>' +
            h(request) +
            '<h2>' + 'body:         ' + b + '</h2>' +
            '</body>' +
            '</html>'

        ));
    }
).listen(3000, () => {
    
})