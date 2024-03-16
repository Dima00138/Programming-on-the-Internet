const http = require('http');
const url = require('url');
const qs = require('qs');

//POST-запроса передача данных
function task3(req, res){
    let task31 = '';
    let ta32 = [];
    req.on('data', (chunk) => {
        let ob = qs.parse(chunk.toString());
        if (parseInt(ob.x) == undefined || parseInt(ob.y) == undefined)
            res.end("Ошибка");
        task31 += parseInt(ob.x) + parseInt(ob.y);
        ta32 = ob.s.split(',');
        
    })

    req.on('end', () => {
        res.end(task31 + ' [' + ta32 + ']');
    })    
}

function task2(req, res) {
    let param = url.parse(req.url, true).query;

    try {
        let result = "";
        result += parseInt(param.x) + parseInt(param.y);
        result += "\n" + parseInt(param.x) - parseInt(param.y);
        result += "\n" + parseInt(param.x) * parseInt(param.y);
        res.end(result);
    }
    catch {
        res.end("ошибка");
    }
    

}

function get_handler(req, res){
    let path = url.parse(req.url).pathname.split('/');
    switch(path[1]){
        case 'task2': task2(req, res);break;
        case 'task3': task3(req, res); break;
        default:
            res.end();
    }
}

const server = http.createServer((req, res)=>{
    console.log(`req.url: ${req.url}    req.method: ${req.method}`);
    get_handler(req, res);
});

server.listen(3000, ()=>{console.log("Server Started")});