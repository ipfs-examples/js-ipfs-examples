/* eslint-disable no-console */
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import Room from 'ipfs-pubsub-room'

const $message = document.querySelector('#message')
const $msgs = document.querySelector('#msgs')
const $addrs = document.querySelector('#addrs')
const $peers = document.querySelector('#peers')
const $pAddrs = document.querySelector('#peers-addrs')

const NAMESPACE = 'ipfs-quick-msg'

const mkRoomName = (name) => {
  return `${NAMESPACE}-${name}`
}

export default (ipfs, peersSet) => {
  const createRoom = (name) => {
    const room = new Room(ipfs, mkRoomName(name))

    room.on('peer joined', (peer) => {
      console.log('peer ' + peer + ' joined')
      peersSet.add(peer)
      updatePeers()
    })

    room.on('peer left', (peer) => {
      console.log('peer ' + peer + ' left')
      peersSet.delete(peer)
      updatePeers()
    })

    // send and receive messages
    room.on('message', (message) => {
      console.log('got message from ' + message.from.toString() + ': ' + uint8ArrayToString(message.data))
      const node = document.createElement('li')
      node.innerText = `${message.from.toString().substr(-4)}: ${uint8ArrayToString(message.data)}`
      $msgs.appendChild(node)
    })

    return room
  }

  const sendMsg = (room) => {
    const msg = $message.value
    if (msg.length > 0) {
      $message.value = ''
      room.broadcast(msg)
      $message.focus()
    }
  }

  const updatePeers = () => {
    const tags = Array.from(peersSet).map((p) => {
      return `<li>${p}</li>`
    })
    $peers.innerHTML = tags.join('')
  }

  const updateSwarmPeers = async (ipfs) => {
    const peers = await ipfs.swarm.peers()

    $pAddrs.innerHTML = peers.map(peer => `<li>${peer.peer}</li>`).join('')
  }

  const updateAddrs = async (ipfs) => {
    const info = await ipfs.id()

    // see which peers support the circuit relay protocol
    const relayAddrs = []
    const peers = await ipfs.swarm.peers()

    for (let i = 0; i < peers.length; i++) {
      const {
        peer: peerId
      } = peers[i]

      const cons = ipfs.libp2p.getConnections(peerId)

      for (let j = 0; j < cons.length; j++) {
        const con = cons[j]
        const remoteAddr = con.remoteAddr.toString()

        for (let k = 0; k < 5; k++) {
          // protocols is undefined until the connection is negotiated so try a few times
          const protocols = await ipfs.libp2p.peerStore.protoBook.get(con.remotePeer)

          if (!protocols) {
            await new Promise ((r) => {
              return setTimeout(() => {
                r()
              },(500))
            })
          }

          if (protocols) {
            const isRelay = protocols.find(proto => proto.toString().includes('/circuit/relay'))

            // only add addresses for peers that are relays and that we aren't already
            // connected to them via another relay
            if (isRelay && !remoteAddr.includes('p2p-circuit') && !remoteAddr.includes(info.id)) {
              relayAddrs.push(`${remoteAddr}/p2p-circuit/p2p/${info.id}`)
            }

            break
          }
        }
      }
    }

    $addrs.innerHTML = relayAddrs.map((addr) => `<li>${addr.toString()}</li>`).join('')
  }

  return {
    createRoom,
    sendMsg,
    updatePeers,
    updateSwarmPeers,
    updateAddrs
  }
}
