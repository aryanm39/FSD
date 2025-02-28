const http = require("http");
const fs = require("fs");
const url = require("url");

http.createServer((req, res) => {
  const q = url.parse(req.url, true); // true parses the query string into an object
  console.log("Query:", q.query);

  // Access query parameters
  const file1 = q.query.file1;
  const file2 = q.query.file2;

  console.log("File 1:", file1);
  console.log("File 2:", file2);

  // Check if the files are provided in the query
  if (file1 && file2) {
    try {
      const data = fs.readFileSync(file2);
      fs.appendFile(file1, data, (err) => {
        if (err) {
          console.log(err);
          res.end("Error appending data.");
        } else {
          console.log("Content appended successfully.");
          res.end("Content appended successfully.");
        }
      });
    } catch (error) {
      console.log(error);
      res.end("Error reading the file.");
    }
  } else {
    res.end("Please provide both file1 and file2 query parameters.");
  }

}).listen(3000, () => {
  console.log("Server is listening on port 3000");
});

