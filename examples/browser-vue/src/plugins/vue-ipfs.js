import { create } from 'ipfs-core'

export default {
  install: (app, options) => {
    app.config.globalProperties.$ipfs = create(options)
  }
}
