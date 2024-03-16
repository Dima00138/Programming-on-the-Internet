const http = require('http');

let SendJson = JSON.stringify(
    {
    "__comment": "CommentFish", 
    "x": 5, 
    "y": 6,
    "s": "Cообщение",
    "m": ["a","b","c","d"],
    
    "o":
        {
            "surname": "surnameFish",
            "Nname": "NameFish"
        }
    }
);

let UrlPath = '/json';

let options = {
    host: 'localhost',
    path: UrlPath,
    port: 5000,
    method: 'POST',
    headers: {
        'content-type':'applitation/json', 
        'accept':'application/json'
    }
}

const req = http.request(options, (res)=>{

    let data = '';

    res.on('data',(chunk)=>{
        data += chunk;
    });

    res.on('end', ()=>{
        console.log("statusCode " + res.statusCode);
        console.log(JSON.parse(data));
    })

})

req.on('error', (e)=>{console.log(e.message);});

req.write(SendJson);

req.end(SendJson);
