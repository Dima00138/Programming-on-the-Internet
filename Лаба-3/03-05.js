const http = require('http');
const url = require('url');

const fact = (num, callback) => {
    if (num === 1 || num === 0) {
        setImmediate(() => {
            callback(null, 1);
          });
    }
    else {
        setImmediate(() => {
            fact(num - 1, (err, result) => {
                if (err) {
                    console.log(err);
                    callback(err);
                }else {
                    callback(null, num*result)
                }
            })
        })
    }
}

http.createServer(
    (request, response) => {
        let path = url.parse(request.url).pathname;
        if (path === '/fact') {
            let k = parseInt(url.parse(request.url, true).query.k);
            if (Number.isInteger(k)) {
                response.writeHead(200, { 'Content-Type': 'application/json;charset=utf8' });
                fact(k, (err, res) => {
                  if (err) {
                    response.end(JSON.stringify({ k: k, fact: err.message }));
                  } else {
                    response.end(JSON.stringify({ k: k, fact: res }));
                  }
                });
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
            setTimeout(()=> {html += '</ol></body></html>';
            response.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
            response.end(html);}, 300);
        }
    }
).listen(3000, () => {
    console.log("Server running at http://localhost:3000/")
});