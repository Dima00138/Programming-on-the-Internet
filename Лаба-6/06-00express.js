const express = require('express');
const fs = require('fs');
const qs = require('qs');
const multiparty = require('multiparty');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
}); 

// GET /connection?set=set
app.get('/connection', (req, res) => {
  const param = req.query.set;

  if (typeof param !== 'undefined') {
    app.keepAliveTimeout = parseInt(param);
    res.send(`Set keepAliveTimeout: ${app.keepAliveTimeout}`);
  } else {
    res.send(`App keepAliveTimeout: ${app.keepAliveTimeout}`);
  }
});

// GET /headers
app.get('/headers', (req, res) => {
  const reqHeaders = req.headers;
  const resHeaders = res.getHeaders();

  let reqAndResInfo = 'request:\n';
  for (const key in reqHeaders) {
    reqAndResInfo += `${key}: ${reqHeaders[key]}\n`;
  }

  reqAndResInfo += 'response:\n';
  for (const key in resHeaders) {
    reqAndResInfo += `${key}: ${resHeaders[key]}\n`;
  }

  res.send(reqAndResInfo);
});
  
// GET /user/:id
app.get('/user/:id', (req, res) => {
  const param = req.params.id;

  if (param === '' || param === undefined || !Number.isInteger(+param)) {
    return res.status(404).send('<h1>404 Ошибка</h1>');
  }

  const userJson = JSON.parse(fs.readFileSync('Лаба-6/static/user.json'));
  const result = userJson.filter((el) => el.id == param);

  if (result[0] === undefined) {
    return res.status(405).send('<h1>405 Ошибка</h1>');
  }

  res.send(`name = ${result[0].name}`);
});

// GET /formparameter
app.get('/formparameter', (req, res) => {
  res.sendFile(path.join(__dirname, '6.html'));
});

// POST /formparameter
app.use(express.urlencoded({ extended: true }));
app.post('/formparameter', (req, res) => {
  const params = req.body;
  let result = '<br/>';

  console.log(req.body, req.query);

  for (let key in params) {
    result += `${key} = ${params[key]}<br/>`;
  }
  res.set('Content-Type', 'text/html');
  res.write('<h1>Parameters (POST):</h1>');
  res.end(result);
});

// GET /json
app.get('/json', (req, res) => {
  res.sendFile(path.join(__dirname, '7.html'));
});

// POST /json
app.post('/json', (req, res) => {
  let body = '';

  req.on('end', () => {
    let requestData = JSON.parse(body);

    console.log(req);

    let responseData = {
      '__comment': requestData.__comment,
      'x_plus_y': parseInt(requestData.x) + parseInt(requestData.y),
      'Concatination_s_o': requestData.s + ' : ' + requestData.o.surname + ' ' + requestData.o.Nname,
      'Length_m': requestData.m.length,
    };

    res.set('Content-Type', 'application/json');
    res.send(responseData);
  });
});

// GET /public/:filename
app.get('/public/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'static', req.params.filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send('File not found');
    } else {
      res.sendFile(filePath);
    }
  });
});

// GET /upload
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, '9.html'));
});

// POST /upload
app.post('/upload', (req, res) => {
  const form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).send('File upload failed');
      return;
    }

    const file = files.fileInput[0];
    const tempPath = file.path;
    const fileName = file.originalFilename;
    const targetPath = path.join(__dirname, 'static', fileName);

    fs.rename(tempPath, targetPath, (err) => {
      if (err) {
        res.status(500).send('File upload failed');
      } else {
        res.send('File uploaded successfully');
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});