// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


(async () => {
  try {
    const node = await Ipfs.create();
    const id = await node.id();

    const nodeDOM = document.getElementById("node");
    nodeDOM.innerHTML = id.id;
    nodeDOM.style = "";
  } catch (err) {
    console.error(err);
  }
})();
