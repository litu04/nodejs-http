const http = require('http');

const hostname = "localhost";

const port = 8000;

const fs = require('fs');

const path = require('path');

function requestHandler(req,res){
    console.log(`Request for ${req.url} by method ${req.method}`);

    if(req.method == "GET"){
        var fileUrl;
        if(req.url == "/"){
            fileUrl="/home.html";
        } else if(req.url == "/about.html"){
            fileUrl = "about.html";
        }
         else {
            fileUrl=req.url;
        }
        var filePath = path.resolve('./public'+fileUrl);
        const fileExt = path.extname(filePath);
        if(fileExt == '.html'){
            fs.exists(filePath,(exists) => {
                if(!exists){
                    res.statusCode = 404;
                    res.setHeader('Content-Type','text/html');
                    res.end('<h1>Error 404: ' + fileUrl + ' page not found</h1>');
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type','text/html');
                fs.readFile(filePath,(err,data) => {
                    if(err){
                        console.warn("error in reading the file: ",err);
                        return;
                    }
                    res.end(data);
                });
            })
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type','text/html');
            res.end('<h1>Error 404: ' + fileUrl + 'is not a HTML file</h1>');
            return;
        }
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type','text/html');
        res.end('<h1>Error 404: ' + req.method + ' not supported');
    }
}

const server = http.createServer(requestHandler);

server.listen(port,hostname,(err) => {
    if(err){
        console.log("Error in creating the server: ",err);
        return;
    }
    console.log(`Server is running on https://${hostname}:${port}`);
})