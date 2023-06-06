const express = require("express");

const app = require('../api')

if (process.argv.length < 3 || !process.argv[2].match(/^[1-9][0-9]*$/)) {
  console.error("Usage: node server.js [port number]");
  process.exit(1);
}

const port = parseInt(process.argv[2]);

app.use(express.static('public'))
app.listen(port)
