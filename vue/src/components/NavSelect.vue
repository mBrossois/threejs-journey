<template>
  <div class="dropdown">
    <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
      {{ activeScene }}
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
      <li v-for="option in dropdownOptions" :key="option.title">
        <router-link class="dropdown-item" :to="option.url" v-on:click="setActiveScene(option.title)">{{option.title}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({})
export default class NavSelect extends Vue{
  activeScene = 'Select scene'
  dropdownOptions: {title: string, url: string}[] = [
      {title: "Home", url: "/"},
      {title: "Basic scene", url: "/basic-scene"},
      {title: "Transform objects", url: "/transform-objects"}
  ]

  setActiveScene(title: string) {
    this.activeScene = title;
  }
}
</script>
