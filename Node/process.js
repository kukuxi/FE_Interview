const http = require("http");

const server = http.createServer();
const constcpus = require("os").cpus();
console.log("constcpus :", constcpus);
server.listen(3000, () => {
  process.title = "node test";
  console.log("pidId", process.pid);
});
