const http = require('http');
const qs = require('qs');

let param = qs.stringify({x:3, y:4});

let path = `/task2?${param}`;

let opt = {
    host: 'localhost',
    path: path,
    port: 3000,
    method: 'GET'
}

const req = http.request(opt, (res)=>{

    let data = '';

    res.on('data', (chunk)=>{
        data += chunk.toString('utf8');
    })

    res.on('end', ()=>{
        console.log(`--statusCode: ${res.statusCode}`);
        console.log('end: ' + data);

    });

})

req.on('error', (e)=>{console.log(`http:request: error: ${e.message}`);});

req.end();