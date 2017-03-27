<template>
  <div id="app" class="app" uk-grid>
    <h1>Planning Poker</h1>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss">
  @import "../scss/uikit";

  .app {
    margin: 0 auto;
    width: calc(100% - 20px);
    max-width: 800px;
    padding: 10px;
    color: #333;
  }
  .card {
    margin-bottom: 20px;
  }
  .user-voter {
    flex-basis: 200px;
  }


</style>
