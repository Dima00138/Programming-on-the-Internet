import express, { Request, Response, NextFunction } from 'express';
import https from 'https';
import fs from 'fs';

const app = express();

app.get('/', (req, res) => {
 res.send('Привет, мир!');
});

const options = {
 key: fs.readFileSync(__dirname +'/resource.key'),
 cert: fs.readFileSync(__dirname + '/resource_my.crt'),
 ca: fs.readFileSync(__dirname + '/ca_my.crt')
};

https.createServer(options, app).listen(3000, () => {
 console.log('Сервер запущен на порту 3000');
});