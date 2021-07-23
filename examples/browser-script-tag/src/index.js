document.addEventListener('DOMContentLoaded', async () => {
  const insertAfter = (referenceNode, newNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  const node = await Ipfs.create({ repo: 'ipfs-' + Math.random() })
  window.node = node

  const status = node.isOnline() ? 'online' : 'offline'
  const id = await node.id()

  console.log(`Node status: ${status}`)

  const statusDOM = document.getElementById('status')
  statusDOM.innerHTML = `Node status: ${status}`

  const newDiv = document.createElement("div");
  newDiv.id = "node"
  const newContent = document.createTextNode(`ID: ${id.id}`);
  newDiv.appendChild(newContent);

  insertAfter(statusDOM, newDiv);

  // You can write more code here to use it. Use methods like
  // node.add, node.get. See the API docs here:
  // https://github.com/ipfs/js-ipfs/tree/master/packages/interface-ipfs-core
})
