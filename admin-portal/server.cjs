const { createServer } = require("http");

const hostname = "localhost";
const port = parseInt(process.env.PORT || process.env.APP_PORT || "3000", 10);

// Next.js standalone server
process.chdir(__dirname);
const NextServer = require("./.next/standalone/admin-portal/server.js");

createServer(async (req, res) => {
  try {
    return NextServer.default(req, res);
  } catch (err) {
    console.error("Error occurred handling", req.url, err);
    res.statusCode = 500;
    res.end("Internal server error");
  }
}).listen(port, (err) => {
  if (err) throw err;
  console.log(`> RF City admin ready on http://${hostname}:${port}`);
});
