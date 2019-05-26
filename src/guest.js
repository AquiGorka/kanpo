const wrtc = require('wrtc')
const Peer = require('simple-peer')
const http = require('http')

const PORT = 8000

module.exports = async ({ port = PORT }) => {
  const peer = new Peer({ wrtc, trickle: false })

  // offer
  const offer = await new Promise(r => {
    console.log(' Please input offer:')
    const prompt = data => {
      process.stdin.off('data', prompt)
      const offer = JSON.parse(data)
      console.log('')
      r(offer)
    }
    process.stdin.on('data', prompt)
  })

  // wait for answer
  await new Promise(r => {
    const signal = data => {
      peer.off('signal', signal)
      console.log(' Answer:')
      console.log(JSON.stringify(data))
      console.log('')
      r()
    }
    peer.on('signal', signal)
    peer.signal(offer)
  })

  // waif for connection
  await new Promise(r => {
    console.log(' Waiting for connection...')
    const connect = () => {
      peer.off('connect', connect)
      console.log('Connected')
      console.log('')
      r()
    }
    peer.on('connect', connect)
  })

  // connected, spin up server to send requests
  await new Promise(r => {
    const handler = (req, res) => {
      peer.send(
        JSON.stringify({
          method: req.method,
          headers: req.headers,
          url: req.url,
        }),
      )

      const response = data => {
        console.log('response: ', JSON.parse(data))
        peer.off('data', response)
        res.write(data)
        res.end()
      }
      peer.on('data', response)
    }
    http.createServer(handler).listen(port, () => {
      console.log(`Kanpo running at port: ${port}`)
    })
  })
}
