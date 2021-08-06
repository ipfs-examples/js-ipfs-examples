<template>
  <main class="mt-8 bg-white overflow-hidden shadow sm:rounded-lg p-6">
    <h3 class="text-2xl leading-7 font-semibold">{{ status }}</h3>
    <div id="ipfs-info" v-if="online" class="mt-3 text-gray-600">
      <p>
        ID: <span id="ipfs-info-id">{{ id }}</span>
      </p>
      <p>
        Agent version: <span id="ipfs-info-agent">{{ agentVersion }}</span>
      </p>
    </div>
  </main>
</template>

<script>
export default {
  name: "IpfsInfo",
  data: function() {
    return {
      status: "Connecting to IPFS...",
      id: "",
      agentVersion: "",
      online: false
    };
  },
  mounted: function() {
    this.getIpfsNodeInfo();
  },
  methods: {
    async getIpfsNodeInfo() {
      try {
        // Await for ipfs node instance.
        const ipfs = await this.$ipfs;
        // Call ipfs `id` method.
        // Returns the identity of the Peer.
        const { agentVersion, id } = await ipfs.id();
        this.agentVersion = agentVersion;
        this.id = id;
        // Set successful status text.
        this.status = "Connected to IPFS";
        this.online = ipfs.isOnline;
      } catch (err) {
        // Set error status text.
        this.status = `Error: ${err}`;
      }
    }
  }
};
</script>
