import log from 'why-is-node-running'

import { create } from 'ipfs-core'
import { createRepo } from 'ipfs-repo'
import { FSLock } from 'ipfs-repo/locks/fs'
import all from 'it-all'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { concat as uint8ArrayConcat } from 'uint8arrays/concat'
import { FsDatastore } from 'datastore-fs'
import { BlockstoreDatastoreAdapter } from 'blockstore-datastore-adapter'
import * as dagPb from '@ipld/dag-pb'
import * as dagCbor from '@ipld/dag-cbor'
import * as raw from 'multiformats/codecs/raw'

// multiformat codecs to support
const codecs = [
  dagPb,
  dagCbor,
  raw
].reduce((acc, curr) => {
  acc[curr.name] = curr
  acc[curr.code] = curr

  return acc
}, {})

async function main () {
  const path = '/tmp/custom-repo/.ipfs'

  // Support dag-pb and dag-cbor at a minimum
  const loadCodec = (nameOrCode) => {
    if (codecs[nameOrCode]) {
      return codecs[nameOrCode]
    }

    throw new Error(`Could not load codec for ${nameOrCode}`)
  }

  // Initialize our IPFS node with the custom repo options
  const node = await create({
    repo: createRepo(path, loadCodec, {
      /**
       * IPFS repos store different types of information in separate datastores.
       * Each storage backend can use the same type of datastore or a different one — for example
       * you could store your keys in a levelDB database while everything else is in files.
       * See https://www.npmjs.com/package/interface-datastore for more about datastores.
       */
      root: new FsDatastore(path, {
        extension: '.ipfsroot', // Defaults to '', appended to all files
        errorIfExists: false, // If the datastore exists, don't throw an error
        createIfMissing: true // If the datastore doesn't exist yet, create it
      }),
      // blocks is a blockstore, all other backends are datastores - but we can wrap a datastore
      // in an adapter to turn it into a blockstore
      blocks: new BlockstoreDatastoreAdapter(
        new FsDatastore(`${path}/blocks`, {
          extension: '.ipfsblock',
          errorIfExists: false,
          createIfMissing: true
        })
      ),
      keys: new FsDatastore(`${path}/keys`, {
        extension: '.ipfskey',
        errorIfExists: false,
        createIfMissing: true
      }),
      datastore: new FsDatastore(`${path}/datastore`, {
        extension: '.ipfsds',
        errorIfExists: false,
        createIfMissing: true
      }),
      pins: new FsDatastore(`${path}/pins`, {
        extension: '.ipfspin',
        errorIfExists: false,
        createIfMissing: true
      })
    }, {
      /**
       * A custom lock can be added here. Or the build in Repo `fs` or `memory` locks can be used.
       * See https://github.com/ipfs/js-ipfs-repo for more details on setting the lock.
       */
      lock: FSLock
    }),

    // This just means we dont try to connect to the network which isn't necessary
    // to demonstrate custom repos
    config: {
      Bootstrap: []
    },

    libp2p: {
      nat: {
        enabled: false
      }
    }
  })

  // Test the new repo by adding and fetching some data
  console.log('Ready')
  const { version } = await node.version()
  console.log('Version:', version)

  // Once we have the version, let's add a file to IPFS
  const file = await node.add({
    path: 'test-data.txt',
    content: uint8ArrayFromString('We are using a customized repo!')
  })
  // Log out the added files metadata and cat the file from IPFS
  console.log('\nAdded file:', file.path, file.cid)

  const data = uint8ArrayConcat(await all(node.cat(file.cid)))

  // Print out the files contents to console
  console.log('\nFetched file content:')
  process.stdout.write(data)

  // After everything is done, shut the node down
  console.log('\n\nStopping the node')
  await node.stop()

  // Let users know where they can inspect the repo
  console.log('Check "/tmp/custom-repo/.ipfs" to see what your customized repository looks like on disk.')
}

main()
