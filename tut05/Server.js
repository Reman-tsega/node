const logEvents = require("./logEvents");
const EventEmitter = require("events");
const fs = require("fs");
const path = require("path");
const http = require("http");

// Create class and extend the EventEmitter class
class Emitter extends EventEmitter {}

// Initialize the object of the class
const myEmitter = new Emitter();
// Listen for the event
myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName));
myEmitter.on("error", (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 5000;

const serveFile = (filePath, contentType, response, reqUrl) => {
    try {
        const data = fs.readFileSync(
            filePath,
            !contentType.includes('html') ? 'txt' : 'utf-8'
        );
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200, {
                'Content-Type': contentType
            }
        );
        response.end(data);

        // Log the successful request
        myEmitter.emit("log", `Success: ${response.statusCode} ${reqUrl}`, "access.log");
    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.end('File not found');

        // Log the error request
        myEmitter.emit("error", `Error: ${response.statusCode} ${reqUrl}`, "error.log");
    }
}

const server = http.createServer((req, res) => {
    const extension = path.extname(req.url);
    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        default:
            contentType = 'text/html';
            break;
    }

    let filePath = 
        contentType === 'text/html' && req.url === '/' ? 
        path.join(__dirname, 'Views/subdir', 'index.html') : 
        contentType === 'text/html' && req.url.slice(-1) === '/' ? 
        path.join(__dirname, 'Views/subdir', req.url, 'index.html') : 
        contentType === 'text/html' ? 
        path.join(__dirname, 'Views/subdir', req.url) : 
        path.join(__dirname, req.url);

    if (!extension && req.url.slice(-1) !== '/') filePath += '/index.html';

    const fileExist = fs.existsSync(filePath);

    if (fileExist) {
        serveFile(filePath, contentType, res, req.url);
    } else {
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, {
                    'Location': 'new-page.html'
                });
                res.end();
                myEmitter.emit("log", `Redirect: ${res.statusCode} ${req.url}`, "access.log");
                break;
            case 'www-page.html':
                res.writeHead(301, {
                    'Location': '/'
                });
                res.end();
                myEmitter.emit("log", `Redirect: ${res.statusCode} ${req.url}`, "access.log");
                break;
            default:
                serveFile(path.join(__dirname, 'Views', 'subdir', '404.html'), 'text/html', res, req.url);
        }
    }
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
