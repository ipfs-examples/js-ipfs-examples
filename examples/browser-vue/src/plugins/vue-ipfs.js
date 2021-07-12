import IPFS from 'ipfs'

export default {
  install: (app, options) => {
    app.config.globalProperties.$ipfs = IPFS.create(options)
  }
}
