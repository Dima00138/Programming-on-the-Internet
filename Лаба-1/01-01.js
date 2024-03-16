const http = require('http');

http.createServer(
    (request, repsonse) => {
        repsonse.writeHead(200, {'Content-Type': 'text/html'});
        repsonse.end('<h1>Hello World</h1>');
    }
).listen(3000, () => {
    
})