<template>
  <div id="nav">
    <NavSelect></NavSelect>
  </div>
  <router-view/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import NavSelect from "@/components/NavSelect.vue";

@Options({
  components: {
    NavSelect
  }
})
export default class App extends Vue {

}
</script>

<style lang="scss">
html, body {
  padding: 0;
  margin: 0;
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 0;
  margin: 0
}

#nav {
  position: fixed;
  right: 2em;
  top: 2em;
  z-index: 100;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
