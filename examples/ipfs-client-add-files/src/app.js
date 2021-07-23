/* eslint-disable no-console */
'use strict'

const { create: ipfsClient } = require('ipfs-client')

const App = () => {
  let ipfs

  const COLORS = {
    active: '#357edd',
    success: '#0cb892',
    error: '#ea5037'
  }

  const scrollToBottom = () => {
    const terminal = document.getElementById('terminal')

    terminal.scroll({ top: terminal.scrollHeight, behavior: 'smooth' })
  }

  const showStatus = (text, bg) => {
    console.info(text)

    const log = document.getElementById('output')

    if (!log) {
      return
    }

    const line = document.createElement('p')
    line.innerText = text
    line.style.color = bg

    log.appendChild(line)

    scrollToBottom(log)
  }

  async function * streamFiles () {
    for (let i = 0; i < 100; i++) {
      await new Promise((resolve) => {
        setTimeout(() => resolve(), 100)
      })

      showStatus(`Sending /file-${i}.txt`, COLORS.active)

      yield {
        path: `/file-${i}.txt`,
        content: `file ${i}`
      }
    }
  }

  const connect = async (grpcApi, httpApi) => {
    showStatus(`Connecting to ${grpcApi} using ${httpApi} as fallback`, COLORS.active)

    ipfs = ipfsClient({
      grpc: grpcApi,
      http: httpApi
    })

    const id = await ipfs.id()
    showStatus(`Daemon active\nID: ${id.id}`, COLORS.success)

    for await (const file of ipfs.addAll(streamFiles(), {
      wrapWithDirectory: true,
      // this is just to show the interleaving of uploads and progress events
      // otherwise we'd have to upload 50 files before we see any response from
      // the server. do not specify this so low in production as you'll have
      // greatly degraded import performance
      fileImportConcurrency: 1,
      progress: (bytes, file) => {
        showStatus(`File progress ${file} ${bytes}`, COLORS.active)
      }
    })) {
      showStatus(`Added file: ${file.path} ${file.cid}`, COLORS.success)
    }

    showStatus('Finished!', COLORS.success)
  }

  // Event listeners
  document.getElementById('connect-submit').onclick = async (e) => {
    e.preventDefault()
    const grpc = document.getElementById('grpc-input').value
    const http = document.getElementById('http-input').value

    try {
      await connect(grpc, http)
    } catch (err) {
      showStatus(err.message, COLORS.error)
      console.error(err)
    }
  }
}

App()
