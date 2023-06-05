const fs = require('fs')
const fetch = require("node-fetch");

// This endpoint only returns first 10000 result and silently discards the rest. So we should implement pagination.
const ENDPOINT = "http://data.e-stat.go.jp/lod/sparql/alldata/query"
const LIMIT = 10000

function validateHead(data, vars) {
  if (data.head.vars.length !== vars.length) {
    throw new Error('Invalid head.vars length')
  }
  vars.forEach((expected, i) => {
    if (data.head.vars[i] !== expected) {
      throw new Error('Invalid head.vars value')
    }
  })
}

function merge(dataList) {
  const output = dataList[0]

  for (const data of dataList.slice(1)) {
    validateHead(data, output.head.vars)

    output.results.bindings.push(...data.results.bindings)
  }

  return output
}

async function main() {
  const query = fs.readFileSync(process.stdin.fd, 'utf-8')

  const dataList = []

  let lastLength = null

  for (let i = 0; ; i++) {
    console.warn(`Downloading page ${i + 1}`)

    const res = await fetch(ENDPOINT + '?query=' + encodeURIComponent(query + ` limit ${LIMIT} offset ${LIMIT * i}`), {
      headers: {
        'Accept': 'application/sparql-results+json'
      }
    })

    const data = await res.json()
    if (data.results.bindings.length === 0) {
      break
    }
    if (lastLength != null && lastLength < LIMIT) {
      throw new Error(`SPARQL endpoint does not return ${LIMIT} rows, actual: ${lastLength}`)
    }

    lastLength = data.results.bindings.length

    dataList.push(data)
  }

  fs.writeFileSync(process.stdout.fd, JSON.stringify(merge(dataList)))
}

main()
