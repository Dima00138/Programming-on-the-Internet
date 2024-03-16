const http = require('http');
const fs = require('fs');

let UrlPath = '/static/MyFile.png';
//http://localhost:5000/task7/1.txt

let options = {
    host: 'localhost',
    path: UrlPath,
    port: 5000,
    method: 'POST',
    headers: {
        'content-type':'text/plain', 
        'accept':'text/plain'
    }
}

const req = http.request(options, (res) => {
    let file = fs.createWriteStream('loaded.jpg');
    res.pipe(file);

    file.on('finish', () => {
        console.log('File downloaded successfully');
    });

    file.on('error', (error) => {
        console.error('File download error:', error);
    });
});

req.on('error', (error) => {
    console.error('Request error:', error);
});

req.end();