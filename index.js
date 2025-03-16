const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(`Zahteva prejeta: ${req.url}`);

    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Pozdravljeni na spletni strani!');
    } else if (req.url === '/funkcionalnosti-odjemalca/') {
        serveHTML(res, 'funkcionalnosti.html');
    } else if (req.url === '/posebnosti/') {
        serveText(res, 'posebnosti.txt');
    } else if (req.url === '/diagram') {
        serveImage(res, 'uml-diagram.png');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Stran ni najdena');
    }

});

function serveHTML(res, filename) {
    const filePath = path.join(__dirname, filename);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Napaka pri branju datoteke');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }

    });
}

function serveText(res, filename) {
    const filePath = path.join(__dirname, filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Napaka pri branju datoteke');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(data);
        }
    });
}

function serveImage(res, filename) {
    const filePath = path.join(__dirname, filename);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Napaka pri branju slike');
        } else {
            res.writeHead(200, { 'Content-Type': 'image/png' }); 
            res.end(data);
        }
    });
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`✅ Strežnik teče na http://localhost:${PORT}`);
});