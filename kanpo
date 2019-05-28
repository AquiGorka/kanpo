#!/usr/bin/env node

const { version } = require('./package.json')
const kanpo = require('./src/index')
const argv = require('minimist')(process.argv.slice(2))

// operations
console.log(`--- Kanpo v${version} ---`)
kanpo({
  port: argv.p || argv.port,
  type: argv.t || argv.type,
})
