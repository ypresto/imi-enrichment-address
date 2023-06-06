const enrichment = require("../main");
const express = require("express");

const app = express()

app.use(express.json())
app.use(express.text())

app.post('/api', async (req, res) => {
  res.json(await enrichment(req.body))
})

module.exports = app
