const http = require('http');
const url = require('url');

const fact = (num) => { return (num > 1) ? num*fact(num-1) : 1 }

http.createServer(
    (request, response) => {
        let path = url.parse(request.url).pathname;
        if (path === '/fact') {
            let k = parseInt(url.parse(request.url, true).query.k);
            if (Number.isInteger(k)) {
                response.writeHead(200, {'Content-Type': 'application/json;charset=utf8'});
                response.end(JSON.stringify({k: k, fact: fact(k)}));
            } 
        }
        else {
            let html ="<!DOCTYPE html><html><head></head><body><ol>";
            const d = Date.now();
            for (let x = 1; x <= 20; x++) {
                fetch(`http://localhost:3000/fact?k=${x}`, {
                    method: 'GET',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                      },
                })
                .then(response => {return response.json()})
                .then((data) => {
                    html += `<li>Результат: ${Date.now() - d}-${data.k}/${data.fact}</li>`;
                    
                });
            }
            setTimeout(() => {html += '</ol></body></html>';
            response.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
            response.end(html);}, 300);
        }
    }
).listen(3000, () => {
    console.log("Server running at http://localhost:3000/")
});