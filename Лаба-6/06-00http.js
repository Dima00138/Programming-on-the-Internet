const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('qs'); //для параметров
const multiparty = require('multiparty'); //для загрузки файла
const path = require('path');

//status-code
let HTTP404 = (req, res) =>{
    res.writeHead(400, { 'Content-Type': 'text/html;charset=utf-8' });
    res.end('<h1>404 Ошибка</h1>');
}
let HTTP405 = (req, res) =>{
    res.writeHead(400, { 'Content-Type': 'text/html;charset=utf-8' });
    res.end('<h1>405 Ошибка</h1>');
}
// /connection?set=set
let connections = (req, res) =>{
    let param = url.parse(req.url, true).query.set;

    if(typeof param != 'undefined'){
        server.keepAliveTimeout = parseInt(param);
        res.end(`Set keepAliveTimeout: ${server.keepAliveTimeout}`);
    }
    else {
        res.end(`Server keepAliveTimeout: ${server.keepAliveTimeout}`);
    }
}
// /headers
let headers = (req, res) => {
    res.setHeader('Content-Type', 'text/html;');
    // res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});

    let ReqAndResInfo = "request: \n";

    for (const key in req.headers) {
        ReqAndResInfo += `${key}: ${req.headers[key]}\n`
    }
    console.log(res.getHeaders());
    ReqAndResInfo += "response: \n";
    for (const key in res.getHeaders()) {
        ReqAndResInfo += `${key}: ${res.getHeader(key)}`;
        
    }

    res.end(ReqAndResInfo);
}

// /user/id
let user = (req, res) =>{
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    
    let param = url.parse(req.url, true).pathname.split('/')[2];

    if (param == '' || param == undefined || !Number.isInteger(+param))
       return HTTP404(req, res);
    
    let userJson = JSON.parse(fs.readFileSync('Лаба-6/static/user.json'));
    const result = userJson.filter((el) => el.id == param);

    if (result[0] == undefined)
        return HTTP405(req, res);
    
    res.end(`name = ${result[0].name}`);
}

// /formparameter
let formparameterGET =  (req, res) =>{
    res.end(fs.readFileSync('Лаба-6/6.html'));
}
let formparameterPOST =  (req, res) =>{
    let data = '';
    req.on('data', (chunk) => {
        data += chunk;
    });

    req.on('end', () => {
        const params = qs.parse(data);
        let result = '<br/>';

        for(let key in params){result += `${key} = ${params[key]}<br/>`}

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h1>Parameters (POST):</h1>');
        res.end(result);
    });
}
// /json
let jsonGET =  (req, res) =>{
    res.end(fs.readFileSync('Лаба-6/7.html'));
}
let jsonPOST =  (req, res) =>{
    console.log("json method:" + req.method);

    let body = "";
    req.on('data', (data) => {
        body += data;
      });
  
      req.on('end', () => {
        let requestData = JSON.parse(body);

        let responseData = {
            '__comment': requestData.__comment,
            'x_plus_y': requestData.x + requestData.y,
            'Concatination_s_o': requestData.s + " : " + requestData.o.surname + " " + requestData.o.Nname,
            'Length_m': requestData.m.length,
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify(responseData)
        );
      });
}

// /public/filename
let files = (req, res) => {
    let SplitUrl = req.url.split('/');
    let FilePath = `${__dirname}\\static\\${SplitUrl[2]}`;

    if (SplitUrl[2] == undefined || SplitUrl[2] == '')
        return HTTP404(req, res);

    fs.access(FilePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('File not found');
        } else {
            fs.createReadStream(FilePath).pipe(res);
        }
    });
}

// /upload
let get_upload =  (req, res) =>{
    res.end(fs.readFileSync('Лаба-6/9.html'));
}
let post_upload =  (req, res) =>{
    const form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('File upload failed');
        return;
      }

      const file = files.fileInput[0];
      const tempPath = file.path;
      const fileName = file.originalFilename;
      const targetPath = path.join(__dirname, 'static', fileName);

      const readStream = fs.createReadStream(tempPath);
      const writeStream = fs.createWriteStream(targetPath);

      readStream.pipe(writeStream);

      readStream.on('end', () => {
        fs.unlinkSync(tempPath); // Удаляем временный файл
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('File uploaded successfully');
      });

      readStream.on('error', (error) => {
        console.error('File upload error:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('File upload failed');
      });
    });
}

let get_handler = (req, res) =>{
    let parsedUrl = url.parse(req.url, true).pathname.split('/');
        switch(parsedUrl[1]){
            case 'connection':        connections(req, res);            break;
            case 'headers':           headers(req, res);                break;
            case 'user':              user(req, res);                   break;
            case 'formparameter':     formparameterGET(req, res);       break;
            case 'json':              jsonGET(req, res);                break;
            case 'public':            files(req, res);                  break;
            case 'upload':            get_upload(req, res);             break;
            default:                  HTTP404(req, res);
    }
}
let post_handler = (req, res) =>{
    let parsedUrl = url.parse(req.url, true).pathname.split('/'); 
    switch(parsedUrl[1]){
        case 'formparameter': formparameterPOST(req, res); break;
        case 'json':          jsonPOST(req, res);          break;
        case 'upload':        post_upload(req, res);       break;
        default:              HTTP404(req, res);
    }
}
let http_handler = (req, res)=>{
    switch(req.method){
        case 'GET':     get_handler(req, res);  break;
        case 'POST':    post_handler(req, res); break;
        default :       HTTP405(req, res);
    }
}


let server = http.createServer();

server.keepAliveTimeout = 10000; // время сохранения соединения с сервером

//middleware
server.on('connection', (socket) => {
    socket.on('data', (data) => {
        // Вывод информации о каждом запросе
        const request = data.toString();
        const [requestLine] = request.split('\r\n');
        const [method, url] = requestLine.split(' ');

        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${method} ${url}`);
    })
})

server.on('request',http_handler);

server.on('close', ()=>{console.log(`Server on close`);});

server.timeout = 10000; // сообщение о бездействии
server.on('timeout', (socket)=>{console.log(`timeout: ${server.timeout}`)});

server.listen(5000, (v)=>console.log('server.listen(5000)'))
        .on('error', (e)=>{console.log(`ERROR: ${e.code}`)});