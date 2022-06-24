import React, { useState } from 'react'
import { create as ipfsClient } from 'ipfs-http-client'

const Detail = ({ value, title }) => {
  const dataTest = title.toString().toLowerCase().replace(' ', '-')

  return (
    <div className='mb4'>
      <Title>{title}</Title>
      <div className='bg-white pa2 br2 truncate monospace' data-test={dataTest}>{value}</div>
    </div>
  )
}

const Form = ({ children, title }) => {
  return (
    <form className="bg-snow center">
      <fieldset className="cf bn ma0 pa0">
        <legend className="pa0 f3 fw4 mb4 aqua tc">{title}</legend>
        <div className="cf">
          {children}
        </div>
      </fieldset>
    </form>
  )
}

const Title = ({ children }) => {
  return (
    <h2 className='f5 ma0 pb2 aqua fw4'>{children}</h2>
  )
}

const App = () => {
  const [id, setId] = useState(null)
  const [version, setVersion] = useState(null)
  const [protocolVersion, setProtocolVersion] = useState(null)
  const [addedFileHash, setAddedFileHash] = useState(null)
  const [addedFileContents, setAddedFileContents] = useState(null)

  const [multiaddr, setMultiaddr] = useState('')
  const [textContent, setTextContent] = useState('hello world from webpack IPFS')
  const [error, setError] = useState(null)

  const connect = async () => {
    try {
      const ipfs = ipfsClient(multiaddr)
      const id = await ipfs.id()

      const file = await ipfs.add(textContent)
      const hash = file.cid

      const source = ipfs.cat(hash)
      let contents = ''
      const decoder = new TextDecoder('utf-8')

      for await (const chunk of source) {
        contents += decoder.decode(chunk, {
          stream: true
        })
      }

      contents += decoder.decode()

      setId(id.id.toString())
      setVersion(id.agentVersion)
      setProtocolVersion(id.protocolVersion)
      setAddedFileHash(hash.toString())
      setAddedFileContents(contents)
      setError(null)
    } catch (e) {
      setError(e.message)
    }
  }

  const reset = () => {
    setId(null)
    setVersion(null)
    setProtocolVersion(null)
    setAddedFileHash(null)
    setAddedFileContents(null)
    setMultiaddr('')
    setError(null)
  }

  const renderDetails = () => {
    const mapping = {
      Id: id,
      Version: version,
      'Protocol Version': protocolVersion,
      'Added File': addedFileHash,
      Content: addedFileContents
    }

    const details = Object.entries(mapping).map(([key, value]) => <Detail title={key} value={value} key={key}></Detail>)

    return (
      <>
        {details}
        <button className="f7 f5-l button-reset pv3 tc bn bg-animate bg-black-80 hover-bg-aqua white pointer w-100" onClick={reset}>Go back</button>
      </>
    )
  }

  return (
    <div className="montserrat">
      <header className='flex items-center pa3 bg-navy bb bw3 b--aqua'>
        <a href='https://ipfs.io' title='home'>
          <img alt='IPFS logo' src="./assets/ipfs-logo.svg" style={{ height: 50 }} className='v-top' />
        </a>
      </header>

      <main className="pa4-l bg-snow mw7 mv5 center pa4">
        {id != null
          ? renderDetails()
          : <Form title="Enter the multiaddr for an IPFS node HTTP API">
            <label htmlFor="connect-input"><Title>Content</Title></label>
            <input className="f7 f5-l input-reset bn black-80 bg-white pa3 w-100 mb3" type="text" name="connect-text" value={textContent} onChange={(e) => setTextContent(e.target.value)} id="connect-text" />
            <label htmlFor="connect-input"><Title>Multiaddr</Title></label>
            <input className="f7 f5-l input-reset bn black-80 bg-white pa3 w-100 mb3" placeholder="/ip4/127.0.0.1/tcp/5001" type="text" name="connect-input" value={multiaddr} onChange={(e) => setMultiaddr(e.target.value)} id="connect-input" />
            <input className="f7 f5-l button-reset pv3 tc bn bg-animate bg-black-80 hover-bg-aqua white pointer w-100" id="connect-submit" type="button" value="Connect" onClick={connect}/>
          </Form>
        }
        {error &&
          <div className='bg-red pa3 center mv3 white'>{error}</div>
        }
      </main>
    </div>
  )
}

export default App
