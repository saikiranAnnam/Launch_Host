require("dotenv").config();
const express = require("express");
const httpProxy = require("http-proxy");

const app = express();
const PORT = 8000;

const BASE_PATH = process.env.BASE_PATH;

const proxy = httpProxy.createProxy();

app.use((req, res) => {
  const hostname = req.hostname;
  const subdomain = hostname.split(".")[0]; // project_id

  // custom Domain - DB query to check for the ID in the data base

  const resolvesTo = `${BASE_PATH}/${subdomain}`;

  proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

//condtion where the user doesnt give any file path
// routing to default : index.html

proxy.on("proxyReq", (proxyReq, req, res) => {
  const url = req.url;
  if (url === "/") {
    proxyReq.path += "index.html";
    return proxyReq;
  }
});

app.listen(PORT, () => console.log(`Reverse Proxy is Running...${PORT}`));
