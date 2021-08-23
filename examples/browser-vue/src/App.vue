<template>
  <header class="header">
    <img alt="Vue logo" src="./assets/vue_logo.png" />
    <svg class="heart" viewBox="0 0 32 29.6">
      <path
        d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
  c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"
      />
    </svg>
    <img class="ipfs-logo" alt="IPFS logo" src="./assets/logo.svg" />
  </header>
  <HelloWorld msg="Welcome to Your Vue.js App" />
  <IpfsInfo />
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import IpfsInfo from "./components/IpfsInfo.vue";

export default {
  name: "App",
  components: {
    IpfsInfo,
    HelloWorld,
  },
};
</script>

<style>
body {
  margin: 0;
}
#app {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  flex-direction: column;
}

.ipfs-logo {
  height: 200px;
}

.heart {
  fill: red;
  position: relative;
  top: 5px;
  width: 50px;
  animation: pulse 1s ease infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.header {
  display: flex;
  gap: 24px;
}
</style>
