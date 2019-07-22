<template>
  <div id="app">
    <v-app>
      <router-view/>
    </v-app>
  </div>
</template>
<script>
  export default {
    name: 'wc-app'
  }
</script>
<style>
  #app {
    width: 100%;
    height: 100%;
  }
</style>