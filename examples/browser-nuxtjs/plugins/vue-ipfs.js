import Vue from 'vue'
import IPFS from 'ipfs'

const IPFSPlugin = {
  install: (app, options) => {
    app.prototype.$ipfs = IPFS.create(options)
  }
}

Vue.use(IPFSPlugin, {})
