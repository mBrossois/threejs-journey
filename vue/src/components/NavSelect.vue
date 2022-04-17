<template>
  <div class="dropdown">
    <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
            aria-expanded="false">
      {{ activeScene }}
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
      <li v-for="option in dropdownOptions" :key="option.title">
        <router-link v-if="option.url" class="dropdown-item" :to="option.url" v-on:click="setActiveScene(option.title)">
          {{ option.title }}
        </router-link>
        <h6 v-else-if="option.sectionTitle" class="dropdown-header exercises-section">{{option.title}}</h6>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({})
export default class NavSelect extends Vue {
  activeScene = 'Select scene'
  dropdownOptions: { title: string, url?: string, sectionTitle?: boolean }[] = [
    {title: 'Basics', sectionTitle: true},
    {title: "Home", url: "/"},
    {title: "Basic scene", url: "/basic-scene"},
    {title: "Transform objects", url: "/transform-objects"},
    {title: "Animations", url: "/animations"},
    {title: "Camera's", url: "/cameras"},
    {title: "Fullscreen and resizing", url: "/fullscreen"},
  ]

  setActiveScene(title: string) {
    this.activeScene = title;
  }
}
</script>

<style lang="scss">
.dropdown-header.exercises-section {
  font-weight: bolder;
  font-size: 1.4rem;
}
</style>
