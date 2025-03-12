const http = require('http');
const url = require('url');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    
    res.setHeader('Content-Type', 'text/html');
    
    const myUrl = url.parse(req.url);
    console.log(`Parsed Pathname: ${myUrl.pathname}`);
    
    if (myUrl.pathname === '/') {
        res.statusCode = 200;
        res.end('<h1>Welcome to the Home Page</h1>');
    } else {
        res.statusCode = 404;
        console.error(`Error 404: Page not found - ${myUrl.pathname}`);
        res.end('<h1>404 - PAGE NOT FOUND</h1>');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
