const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.wasm': 'application/wasm',
        '.data': 'application/octet-stream',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gz': 'application/gzip' // ? ????? ??? ???? ???????? ?????
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('404: File Not Found');
            } else {
                res.writeHead(500);
                res.end('500: Server Error');
            }
        } else {
            const headers = {
                'Content-Type': contentType
            };

            // ??? ???? gz ????? ??? gzip ?? ?????
            if (filePath.endsWith('.gz')) {
                headers['Content-Encoding'] = 'gzip';
            }

            res.writeHead(200, headers);
            res.end(content, 'utf-8');
        }
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`? Server running at http://localhost:${port}/`);
});
