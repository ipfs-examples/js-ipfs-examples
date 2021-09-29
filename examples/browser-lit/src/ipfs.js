'use strict'

import {html, LitElement} from 'lit';
import { create } from 'ipfs-core'

export class IPFSInfo extends LitElement {
  static get properties() {
    return {
      _ipfs: {state: true},
      _id: {state: true},
      _version: {state: true},
      _agentVersion: {state: true}
    }
  }

  constructor() {
    super();

    this._ipfs = null;
    this._id = null;
    this._version = null;
    this._agentVersion = null;
  }

  connectedCallback() {
    super.connectedCallback()

    this.initIPFS();
  }

  async initIPFS() {
    const ipfs = await create();
    const id = await ipfs.id();
    const version = await ipfs.version();

    this._ipfs = ipfs
    this._id = id.id;
    this._agentVersion = id.agentVersion;
    this._version = version.version;
  }

  render() {
    if (!this._ipfs) {
      return html`Loading...`;
    }

    const info = {
      'Id': this._id,
      'Agent Version': this._agentVersion,
      'Version': this._version,
    }

    return html`
      <section>
        <h1 data-test='title'>Connected to IPFS</h1>
        <div>
          ${Object.entries(info).map(([key, value]) => {
            return html`
              <div>
                <h2>${key}</h2>
                <div data-test=${key.replace(/\s+/g, '')}>${value}</div>
              </div>
              `
            }
          )}
        </div>
      </section>
    `;
  }
}

customElements.define('ipfs-info', IPFSInfo);
