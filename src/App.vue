<template>
  <div id="app">
    <router-view :address="address"/>
  </div>
</template>

<script>
import axios from 'axios'
import SHA256 from 'crypto-js/sha256'
export default {
  created(){
    this.getAddress();
  },
  data(){
    return {
      node: this.$store.getters.node,
      hide: this.$store.getters.hide,
      address: null,
      nodeData: null,
      mineData: null,
      cores: this.getCores()
    }
  },
  watch: {
    mineData(val){
      setTimeout(() => {this.getMineData();}, val.expireTime - Date.now());
    }
  },
  methods: {
    getAddress(){
      axios.get(this.node + '/data').then(res => {
        this.address = res.data.address;
        this.nodeData = res.data;
        this.getMineData();
      }).catch(error => {
        console.log(error.response.data);
      });
    },
    getCores(){
      let cores = navigator.hardwareConcurrency;
      if(cores > 8){
        return 25;
      } else if(cores > 4){
        return 50;
      } else if(cores > 2){
        return 75;
      } else if(cores > 1){
        return 100;
      } else {
        return 250;
      }
    },
    getMineData(){
      axios.get(this.node + '/miner').then(res => {
        this.mineData = res.data;
        let proof = {address: this.address, timestamp: Date.now(), nonce: 0};
        proof.hash = SHA256(proof.address + proof.timestamp + proof.nonce).toString();
        this.hashLoop({proof, difficulty: this.mineData.difficulty});
      }).catch(error => {
        console.log(error);
      });
    },
    sleep(data){
      return new Promise(resolve => setTimeout(resolve, data));
    },
    async hashLoop(data){
        let proof = data.proof;
        let difficulty = data.difficulty;
      let i = 0;
      while(!proof.hash.startsWith('0'.repeat(difficulty))){
        if(i % 5 === 0){
          await this.sleep(this.cores);
        }
        proof.nonce++;
        proof.hash = SHA256(proof.address + proof.timestamp + proof.nonce).toString();
        i++;
      }
      this.sendMine(proof);
    },
    sendMine(data){
      axios.post(this.node + '/miner', data).then(res => {
        console.log(res.data);
        let proof = {address: this.address, timestamp: Date.now(), nonce: 0};
        proof.hash = SHA256(proof.address + proof.timestamp + proof.nonce).toString();
        this.hashLoop({proof, difficulty: this.mineData.difficulty});
      }).catch(error => {
        console.log(error.response.data);
        let proof = {address: this.address, timestamp: Date.now(), nonce: 0};
        proof.hash = SHA256(proof.address + proof.timestamp + proof.nonce).toString();
        this.hashLoop({proof, difficulty: this.mineData.difficulty});
      });
    }
  }
}
</script>

<style>
body {
overflow-wrap: break-word;
overflow-wrap: break-all;
word-wrap: break-word;

-ms-word-break: break-all;
/* This is the dangerous one in WebKit, as it breaks things wherever */
/* Instead use this non-standard one: */
word-break: break-word;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
