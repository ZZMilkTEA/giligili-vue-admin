<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      mainHeight : window.innerHeight - 80
    }
  },
  methods:{
    getHeight(){
      this.mainHeight = window.innerHeight - 80;
      console.log(this.mainHeight);
    }
  },

  created(){
    window.addEventListener('resize', this.getHeight);
    this.getHeight();
  },
  destroyed(){
    window.removeEventListener('resize', this.getHeight)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>



