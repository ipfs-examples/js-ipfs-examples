import React, { useState, useRef } from 'react';
import ipfsLogo from './ipfs-logo.svg'
import { create } from 'ipfs-core'

function App() {
  const [output, setOutput] = useState([]);
  const [ipfs, setIpfs] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');

  const terminalEl = useRef(null);

  const COLORS = {
    active: '#357edd',
    success: '#0cb892',
    error: '#ea5037'
  }

  const showStatus = (text, color, id) => {
    setOutput((prev) => {
      return [...prev,
        {
        'content': text,
        'color': color,
        'id': id
        }
      ]
    })

    terminalEl.current.scroll({ top: terminal.scrollHeight, behavior: 'smooth' })
  }

  const store = async (name, content) => {
    let node = ipfs;

    if (!ipfs) {
      showStatus('Creating IPFS node...', COLORS.active)

      node = await create({
        repo: String(Math.random() + Date.now()),
        init: { algorithm: 'Ed25519' }
      })

      setIpfs(node)
    }

    const id = await node.id()
    showStatus(`Connecting to ${id.id}...`, COLORS.active, id.id)

    const fileToAdd = {
      path: `${name}`,
      content: content
    }

    showStatus(`Adding file ${fileToAdd.path}...`, COLORS.active)
    const file = await node.add(fileToAdd)

    showStatus(`Added to ${file.cid}`, COLORS.success, file.cid)
    showStatus('Reading file...', COLORS.active)

    const decoder = new TextDecoder()
    let text = ''

    for await (const chunk of node.cat(file.cid)) {
      text += decoder.decode(chunk, {
        stream: true
      })
    }

    showStatus(`\u2514\u2500 ${file.path} ${text}`)
    showStatus(`Preview: https://ipfs.io/ipfs/${file.cid}`, COLORS.success)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (fileName == null || fileName.trim() === '') {
        throw new Error('File name is missing...')
      }

      if ((fileContent == null || fileContent.trim() === '')) {
        throw new Error('File content is missing...')
      }

      await store(fileName, fileContent)
    } catch (err) {
      showStatus(err.message, COLORS.error)
    }
  }

  return (
    <>
      <header className='flex items-center pa3 bg-navy bb bw3 b--aqua'>
        <a href='https://ipfs.io' title='home'>
          <img alt='IPFS logo' src={ipfsLogo} style={{ height: 50 }} className='v-top' />
        </a>
      </header>

      <main className="pa4-l bg-snow mw7 mv5 center pa4">
        <h1 className="pa0 f2 ma0 mb4 aqua tc">Add data to IPFS from the browser</h1>

        <form id="add-file" onSubmit={handleSubmit}>
          <label htmlFor="file-name" className="f5 ma0 pb2 aqua fw4 db">Name</label>
          <input
            className="input-reset bn black-80 bg-white pa3 w-100 mb3"
            id="file-name"
            name="file-name"
            type="text"
            placeholder="file.txt"
            required
            value={fileName} onChange={(e) => setFileName(e.target.value)}
          />

          <label htmlFor="file-content" className="f5 ma0 pb2 aqua fw4 db">Content</label>
          <input
            className="input-reset bn black-80 bg-white pa3 w-100 mb3 ft"
            id="file-content"
            name="file-content"
            type="text"
            placeholder="Hello world"
            required
            value={fileContent} onChange={(e) => setFileContent(e.target.value)}
          />

          <button
            className="button-reset pv3 tc bn bg-animate bg-black-80 hover-bg-aqua white pointer w-100"
            id="add-submit"
            type="submit"
          >
            Add file
          </button>
        </form>

        <h3>Output</h3>

        <div className="window">
          <div className="header"></div>
          <div id="terminal" className="terminal" ref={terminalEl}>
            { output.length > 0 &&
              <div id="output">
                { output.map((log, index) =>
                  <p key={index} style={{'color': log.color}} id={log.id}>
                    {log.content}
                  </p>)
                }
              </div>
            }
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
