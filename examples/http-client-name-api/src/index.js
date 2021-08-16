/* eslint-disable no-console */
'use strict'

import { create as ipfsHttp } from 'ipfs-http-client'

const App = () => {
  let ipfs = null

  const DOM = {
    status: document.getElementById('status'),
    buttons: document.getElementsByTagName('button'),
    connect: document.getElementById('connect-to-http-api'),
    publishNew: document.getElementById('publish-text'),
    publishPath: document.getElementById('publish-path'),
    resolveName: document.getElementById('resolve-name'),
    publishResultsDiv: document.querySelector('.results--publish'),
    resolveResultsDiv: document.querySelector('.results--resolve'),
    publishResult: document.getElementById('publish-result'),
    resolveResult: document.getElementById('resolve-result'),
    resolveIpns: document.getElementById('resolve-ipns'),
    publishGatewayLink: document.getElementById('publish-gateway-link'),
    resolveGatewayLinkIPFS: document.getElementById('resolve-gateway-link-ipfs'),
    resolveGatewayLinkIPNS: document.getElementById('resolve-gateway-link-ipns')
  }

  const COLORS = {
    active: '#357edd',
    success: '#0cb892',
    error: '#ea5037'
  }

  const IPFS_DOMAIN = 'https://ipfs.io'

  const showStatus = (text, bg) => {
    DOM.status.innerText = text
    DOM.status.style.background = bg
  }

  const enableForms = () => {
    for (const btn of DOM.buttons) {
      btn.disabled = false
    }
  }

  const disableForms = () => {
    for (const btn of DOM.buttons) {
      btn.disabled = true
    }
  }

  const connect = async (e) => {
    e.preventDefault()

    const input = e.target.elements['connect-input'].value.trim()
    showStatus(`Connecting to ${input}`, COLORS.active)

    try {
      ipfs = ipfsHttp(input)
      const res = await ipfs.id()

      showStatus(`Daemon active\nID: ${res.id}`, COLORS.success)
      enableForms()
    } catch (err) {
      showStatus('Failed to connect to daemon', COLORS.error)
      disableForms()
      console.error(err)
    }
  }

  // Adds a new file to IPFS and publish it
  const addAndPublish = async (e) => {
    e.preventDefault()

    const input = e.target.elements['add-file-input']
    const buffer = new TextEncoder().encode(input.value)

    showStatus('Adding to IPFS...', COLORS.active)
    try {
      disableForms()
      const file = await ipfs.add(buffer)
      await publish(file.path)

      showStatus('Success!', COLORS.success)
      input.value = ''
      enableForms()
    } catch (err) {
      showStatus('Failed to add the data', COLORS.error)
      console.error(err)
    }
  }

  // Publishes an IPFS file or directory under your node's identity
  const publish = async (path) => {
    showStatus('Publishing...', COLORS.active)
    DOM.publishResultsDiv.classList.add('hidden')
    disableForms()

    try {
      const res = await ipfs.name.publish(path)

      const name = res.name
      showStatus('Success!', COLORS.success)
      DOM.publishResultsDiv.classList.remove('hidden')
      DOM.publishResult.innerHTML = `/ipns/${name}`
      DOM.publishGatewayLink.href = `${IPFS_DOMAIN}/ipns/${name}`
    } catch (err) {
      showStatus(`Error publishing ${path}`, COLORS.error)
      console.error(err)
    }

    enableForms()
  }

  // Resolves an IPNS name
  const resolve = async (name) => {
    showStatus('Resolving...', COLORS.active)
    DOM.resolveResultsDiv.classList.add('hidden')

    try {
      for await (const path of ipfs.name.resolve(name)) {
        showStatus('Success!', COLORS.success)
        DOM.resolveResultsDiv.classList.remove('hidden')
        DOM.resolveResult.innerText = path
        DOM.resolveIpns.innerText = name
        DOM.resolveGatewayLinkIPFS.href = `${IPFS_DOMAIN}${path}`
        DOM.resolveGatewayLinkIPNS.href = `${IPFS_DOMAIN}/ipns/${name}`
      }
    } catch (err) {
      showStatus(`Error resolving ${name}`, COLORS.error)
      console.error(err)
    }
  }

  DOM.connect.onsubmit = connect
  DOM.publishNew.onsubmit = addAndPublish
  DOM.publishPath.onsubmit = (e) => {
    e.preventDefault()
    const input = e.target.elements['publish-cid-input']
    publish(input.value)
    input.value = ''
  }

  DOM.resolveName.onsubmit = (e) => {
    e.preventDefault()
    const input = e.target.elements['resolve-name-input']
    resolve(input.value)
    input.value = ''
  }
}

App()
