<template>
  <div id="httpError">
    <p>{{httpError.title}}</p>
    <p v-if="httpError.detail">{{httpError.detail}}</p>
    <p v-if="httpError.instance">{{httpError.instance}}</p>
    <ul v-if="hasInvalidArguments">
      <li v-for="(invalidParameter, i) in httpError.invalidParameters" :key="i">
        <strong>{{invalidParameter.name}}</strong>
        : {{invalidParameter.reason}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HttpError from "@/Model/Error/HttpError";
import HttpErrorWithInvalidArguments from "@/Model/Error/HttpErrorWithInvalidArguments";

export default Vue.extend({
  name: "HttpError",
  props: {
    httpError: HttpError
  },
  methods: {
    hasInvalidArguments(httpError: HttpError): boolean {
      return (
        httpError instanceof HttpErrorWithInvalidArguments &&
        httpError.invalidParameters.length > 0
      );
    }
  }
});
</script>
