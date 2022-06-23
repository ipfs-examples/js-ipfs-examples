import { create } from 'ipfs-core'
import VideoStream from 'videostream'
import toStream from 'it-to-stream'
import {
  dragDrop,
  statusMessages,
  createVideoElement,
  log
} from './utils.js'

const App = async () => {
  // DOM
  const DOM = {
    cidInput: () => document.getElementById('cid'),
    goButton: () => document.getElementById('gobutton'),
    file: () => document.getElementById('file')
  }

  log('IPFS: Initializing')
  const videoElement = createVideoElement()
  const ipfs = await create({ repo: 'ipfs-' + Math.random() })

  // Allow adding files to IPFS via drag and drop
  dragDrop(ipfs, log)

  log('IPFS: Ready')
  log('IPFS: Drop an .mp4 file into this window to add a file')
  log('IPFS: Then press the "Go!" button to start playing a video')

  DOM.cidInput().disabled = false
  DOM.goButton().disabled = false
  let stream

  DOM.goButton().addEventListener('click', (event) => {
    event.preventDefault()

    log(`IPFS: Playing ${DOM.cidInput().value.trim()}`)

    // Set up the video stream an attach it to our <video> element
    const videoStream = new VideoStream({
      createReadStream: function createReadStream (opts) {
        const start = opts.start

        // The videostream library does not always pass an end byte but when
        // it does, it wants bytes between start & end inclusive.
        // catReadableStream returns the bytes exclusive so increment the end
        // byte if it's been requested
        const end = opts.end ? start + opts.end + 1 : undefined

        log(`Stream: Asked for data starting at byte ${start} and ending at byte ${end}`)

        // If we've streamed before, clean up the existing stream
        if (stream && stream.destroy) {
          stream.destroy()
        }

        // This stream will contain the requested bytes
        stream = toStream.readable(ipfs.cat(DOM.cidInput().value.trim(), {
          offset: start,
          length: end && end - start
        }))

        // Log error messages
        stream.on('error', (error) => log(error))

        if (start === 0) {
          // Show the user some messages while we wait for the data stream to start
          statusMessages(stream, log)
        }

        return stream
      }
    }, videoElement)

    videoElement.addEventListener('error', () => log(videoStream.detailedError))
  })
}


document.addEventListener('DOMContentLoaded', async () => App())
