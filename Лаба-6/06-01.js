const http = require('http');

let opt = {
    host: 'localhost',
    path: '/mypath',
    port: 5000,
    method: 'GET'
}

const req = http.request(opt, (res)=>{
    console.log(`http.request:`);
    console.log(`--method:\t${req.method}`);

    console.log('response:');
    console.log(`--statusCode: ${res.statusCode}`);
    console.log(`--statusMessage: ${res.statusMessage}`);
})

req.on('error', (e)=>{console.log(`http:request: error: ${e.message}`);});

req.end();