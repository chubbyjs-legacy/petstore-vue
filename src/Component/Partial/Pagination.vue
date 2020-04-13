<template>
  <ul v-if="pages.length > 1" class="pagination">
    <li v-if="currentPage > 2">
      <button v-on:click="submitPage(1)">&laquo;</button>
    </li>
    <li v-if="currentPage > 1">
      <button v-on:click="submitPage(currentPage - 1)">&lt;</button>
    </li>
    <li v-for="(page, i) in pages" :key="i">
      <button
        v-bind:class="{ current: currentPage === page }"
        v-on:click="submitPage(page)"
      >{{page}}</button>
    </li>
    <li v-if="currentPage < totalPages">
      <button v-on:click="submitPage(currentPage + 1)">&gt;</button>
    </li>
    <li v-if="currentPage < totalPages - 1">
      <button v-on:click="submitPage(totalPages)">&raquo;</button>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "HttpError",
  props: {
    submitPage: Function,
    currentPage: Number,
    totalPages: Number,
    maxPages: Number
  },
  data(): {
    pages: Array<number>;
  } {
    return {
      pages: []
    };
  },
  methods: {},
  created(): void {
    if (this.totalPages <= 1 || this.maxPages <= 1) {
      return;
    }

    const pages = [this.currentPage];
    for (let i = 1; ; i++) {
      if (this.currentPage - i >= 1) {
        pages.push(this.currentPage - i);

        if (
          pages.length === this.maxPages ||
          pages.length === this.totalPages
        ) {
          break;
        }
      }

      if (this.currentPage + i <= this.totalPages) {
        pages.push(this.currentPage + i);
        if (
          pages.length === this.maxPages ||
          pages.length === this.totalPages
        ) {
          break;
        }
      }
    }

    pages.sort((a, b) => a - b);

    this.pages = pages;
  }
});
</script>
