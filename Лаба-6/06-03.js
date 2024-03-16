const http = require('http');
const qs = require('qs');

let params = qs.stringify({x:3,y:4,s:"xx,xgjrgnjf,dgfmgmf,fg"});

let path = '/task3';

let options = {
    host: 'localhost',
    path: path,
    port: 3000,
    method: 'POST'
}

const req = http.request(options, (res)=>{
    let data = '';
    
    res.on('data', (chunk)=>{
        data += chunk;
    });

    res.on('end', ()=>{
        console.log(`END: ${data}`);
    })

})

req.write(params);
req.on('error', (e)=>{console.log(`http:request: error: ${e.message}`);});

req.end();