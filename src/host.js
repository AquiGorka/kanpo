const wrtc = require('wrtc')
const Peer = require('simple-peer')
const fetch = require('node-fetch')

const PORT = 80

module.exports = async ({ port = PORT }) => {
  const peer = new Peer({ initiator: true, wrtc, trickle: false })

  // offer
  await new Promise(r => {
    const signal = data => {
      peer.off('signal', signal)
      const offer = JSON.stringify(data)
      console.log(' Offer')
      console.log(offer)
      console.log('')
      r()
    }
    peer.on('signal', signal)
  })

  // wait for answer
  const answer = await new Promise(r => {
    console.log(' Please input answer:')
    const prompt = data => {
      process.stdin.off('data', prompt)
      const answer = JSON.parse(data)
      console.log('')
      r(answer)
    }
    process.stdin.on('data', prompt)
  })

  // wait for connection
  await new Promise(r => {
    console.log(' Waiting for connection...')
    peer.signal(answer)
    const connect = () => {
      peer.off('connect', connect)
      console.log(' Connected')
      console.log('')
      r()
    }
    peer.on('connect', connect)
  })

  // requests to guest:other_port will be proxied to here:port
  await new Promise(r => {
    console.log(` Kanpo is running for port ${port}`)
    peer.on('data', async msg => {
      const data = JSON.parse(msg)
      console.log(` Request ${JSON.stringify(data, null, 2)}`)
      const res = await fetch(
        `http://localhost:${port}${data.url}`,
        data.headers,
      )
      console.log(` Local response ${JSON.stringify(res, null, 2)}`)
      peer.send(
        JSON.stringify({
          ok: res.ok,
          status: res.status,
          text: res.statusText,
          headers: res.headers.raw(),
          'content-type': res.headers.get('content-type'),
        }),
      )
      console.log('')
    })
    peer.on('error', err => {
      console.log('Error: ', err)
      console.log('')
    })
  })
}
