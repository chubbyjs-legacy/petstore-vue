<template>
  <div v-bind:class="{ error: invalidParameters.length > 0 }" class="form-field">
    <label>{{label}}</label>
    <input type="text" v-bind:value="value" v-on:input="$emit('input', $event.target.value)" />
    <ul v-if="invalidParameters.length > 0">
      <li v-for="(invalidParameter, i) in invalidParameters" :key="i">{{invalidParameter.reason}}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TextField",
  props: {
    label: String,
    value: String,
    invalidParameters: Array
  }
});
</script>
