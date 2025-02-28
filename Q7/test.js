 const http=  require("http")
 const fs = require("fs")
 const url = require("url")
 
http.createServer((req,res)=>{
  const q = url.parse(req.url,true)
  //console.log(q)
  console.log("Query:",q.query)

  file1 = q.query.file1

  console.log(file1)


  if (file1) {
     try {
       const data = fs.readFileSync(file1);
       res.end(data)
     } catch (error) {
      
       console.log(error);
       res.end.statusCode=404
     }
   } else {

     res.end("Please provide  file1 .");
   }
 
 }).listen(3000, () => {
   console.log("Server is listening on port 3000");
 });