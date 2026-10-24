const http = require("http");
const fs = require("fs");

console.log("started")

const server = http.createServer((req, res) => {
  let filename = "";

  if (req.url === "/") {
    filename = "index.html";
    console.log("A")
  } else {
    console.log("B")
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
