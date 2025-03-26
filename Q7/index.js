const http = require("http")
const url = require("url")
const fs = require("fs")
const server = http.createServer((req,res)=>{
    console.log("Getting response")
    res.statusCode = 200
    res.setHeader("content-type","text/html")

    const myUrl = url.parse(req.url)
    console.log(myUrl.pathname)
    if(myUrl.pathname == "/")
    {
        const data = fs.readFileSync("index.html","utf-8")        
        res.end(data)
    }
    else if(myUrl.pathname == "/about")
    {
        const data = fs.readFileSync("about.html","utf-8")        
        res.end(data)
    }
    else
    {
            res.statusCode = 404
            res.end("PAGE NOT FOUND !!!")
        }
})

server.listen(3000,()=>{
    console.log("Server is listenting at http://localhost:3000/")
})