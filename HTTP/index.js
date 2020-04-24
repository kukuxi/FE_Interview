const http = require("http");

const server = http.createServer();

server.on("request", (req, res) => {
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-length", 11);
    res.setHeader("Transfer-Encoding", "chunked");
    res.write("hello world");

    setTimeout(() => {
      res.write("first time");
    }, 1000);
    setTimeout(() => {
      res.write("second time");
      res.end();
    }, 2000);
  }
});

server.listen(8000, () => {
  console.log("listening on 8000");
});
