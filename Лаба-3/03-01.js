const http = require('http');
var Status = "norm";

http.createServer(
    (request, response) => {
        response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(`<h1>${Status}</h1>`);
    }
).listen(3000, () => {
    console.log("Server running at http://localhost:3000/")
});

process.stdin.setEncoding("utf-8");

process.stdin.on('readable', () => {
    let chunk = null;
while ((chunk = process.stdin.read()) != null) {
    if (chunk.trim() == "exit") process.exit(0);
    if (chunk.trim() == "norm") {
        process.stdout.write(`reg = ${Status}--> ${chunk.trim()}\n`);
        Status = "norm";
}
    if (chunk.trim() == "stop") {
        process.stdout.write(`reg = ${Status}--> ${chunk.trim()}\n`);
        Status = "stop";
}
    if (chunk.trim() == "idle") {
        process.stdout.write(`reg = ${Status}--> ${chunk.trim()}\n`);
        Status = "idle";
}
    if (chunk.trim() == "test") {
        process.stdout.write(`reg = ${Status}--> ${chunk.trim()}\n`);
        Status = "test";
}
process.stdout.write(`${Status}->`);
}
})