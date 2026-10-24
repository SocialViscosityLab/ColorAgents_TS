const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  let filename = "";

  if (req.url === "/") {
    filename = "index.html";
  }
  fs.readFile(filename, (err, data) => {
    if (err) {
      res.writeHead(500, { "content-type": "text/plain" });
      res.end("server error");
      console.log(" Error");
      return;
    } 
  });
});
