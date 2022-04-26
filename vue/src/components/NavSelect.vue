<template>
  <div class="dropdown">
    <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
            aria-expanded="false">
      {{ activeScene }}
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
      <li v-for="option in dropdownOptions" :key="option.title">
        <router-link v-if="!option.sectionTitle" class="dropdown-item" :to="option.url" v-on:click="setActiveScene(option.title)">
          {{ option.title }}
        </router-link>
        <h6 v-else class="dropdown-header exercises-section">{{option.title}}</h6>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {RouteConstants} from "@/utils/route.constants";

@Options({})
export default class NavSelect extends Vue {
  activeScene = 'Select scene'
  dropdownOptions: { title: string, url: string, sectionTitle?: boolean }[] = RouteConstants

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

.dropdown-menu {
  max-height: 20em;
  overflow-y: scroll;
}
</style>
