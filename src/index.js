const host = require('./host')
const guest = require('./guest')

const HOST = 'host'

module.exports = ({ type = HOST, ...config }) => {
  type === HOST ? host(config) : guest(config)
}
