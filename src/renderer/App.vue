<template>
  <div id="app">
    <v-app dark>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
  export default {
    name: 'eptdb'
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.wi {
  font-size: 24px;
  padding: 7px;
}
.wi.large {
  font-size: 36px;
  padding: 0px;
}
.progress-linear {
  margin: 0px;
}
</style>
