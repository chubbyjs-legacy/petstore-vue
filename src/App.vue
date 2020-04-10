<template>
  <div id="wrapper" v-bind:class="{ displayMenu: displayMenu }">
    <nav id="top-nav" class="clearfix">
      <button id="toggle" data-testid="navigation-toggle" v-on:click="setDisplayMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <router-link to="/">Petstore</router-link>
    </nav>
    <nav id="left-nav">
      <ul>
        <li>
          <router-link to="/pet">Pets</router-link>
        </li>
      </ul>
    </nav>
    <div id="main">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",
  data() {
    return {
      displayMenu: false
    };
  },
  methods: {
    setDisplayMenu() {
      this.displayMenu = !this.displayMenu;
    }
  }
});
</script>
