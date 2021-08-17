'use strict'

import Ipfs from 'ipfs'
import Hls from 'hls.js'
import HlsjsIpfsLoader from 'hlsjs-ipfs-loader'

document.addEventListener('DOMContentLoaded', async () => {
  const testHash = 'QmdpAidwAsBGptFB3b6A9Pyi5coEbgjHrL3K2Qrsutmj9K'
  const repoPath = 'ipfs-' + Math.random()
  const node = await Ipfs.create({ repo: repoPath })

  Hls.DefaultConfig.loader = HlsjsIpfsLoader
  Hls.DefaultConfig.debug = false
  if (Hls.isSupported()) {
    const video = document.getElementById('video')
    const status = document.getElementById('status')
    const hls = new Hls()
    hls.config.ipfs = node
    hls.config.ipfsHash = testHash
    hls.loadSource('master.m3u8')
    hls.attachMedia(video)
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      const node = document.createTextNode("Video ready...");
      status.appendChild(node);

      video.play()
    })
  }
})
