<template>
  <div>
    <http-error-partial v-if="httpError" :httpError="httpError" />
    <h1>Create Pet</h1>
    <pet-form :submitPet="submitPet" :unprocessableEntity="unprocessableEntity" />
    <router-link to="/pet" class="btn-gray mb-4">List</router-link>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { CreatePet } from "../../../ApiClient/Pet";
import HttpError from "../../../Model/Error/HttpError";
import HttpErrorPartial from "../../Partial/HttpError.vue";
import PetForm from "../../Form/PetForm.vue";
import PetRequest from "../../../Model/Pet/PetRequest";
import UnprocessableEntity from "../../../Model/Error/UnprocessableEntity";

export default Vue.extend({
  name: "PetCreate",
  components: {
    "http-error-partial": HttpErrorPartial,
    "pet-form": PetForm
  },
  data(): {
    httpError?: HttpError;
  } {
    return {
      httpError: undefined
    };
  },
  computed: {
    unprocessableEntity(): UnprocessableEntity | undefined {
      if (this.httpError instanceof UnprocessableEntity) {
        return this.httpError;
      }

      return undefined;
    }
  },
  methods: {
    async submitPet(pet: PetRequest) {
      const response = await CreatePet(pet);

      if (response instanceof HttpError) {
        this.httpError = response;
      } else {
        this.httpError = undefined;

        this.$router.push("/pet");
      }
    }
  }
});
</script>
