const next = require("next");
const http = require("http");

const APP_DIR = "./admin-portal";
const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || process.env.APP_PORT || 3000;

const app = next({ dev, dir: APP_DIR });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http.createServer((req, res) => handle(req, res)).listen(port, () => {
      console.log(`RF City admin portal ready on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start Next.js server", err);
    process.exit(1);
  });

