<template>
  <div v-if="pet || httpError">
    <http-error-partial v-if="httpError" :http-error="httpError" />
    <h1>Update Pet</h1>
    <pet-form :submitPet="submitPet" :defaultPet="pet" :unprocessableEntity="unprocessableEntity" />
    <router-link to="/pet" class="btn-gray mb-4">List</router-link>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ReadPet, UpdatePet } from "@/ApiClient/Pet";
import HttpError from "@/Model/Error/HttpError";
import HttpErrorPartial from "@/Component/Partial/HttpError.vue";
import PetForm from "@/Component/Form/PetForm.vue";
import PetRequest from "@/Model/Pet/PetRequest";
import PetResponse from "@/Model/Pet/PetResponse";
import UnprocessableEntity from "@/Model/Error/UnprocessableEntity";

export default Vue.extend({
  name: "PetUpdate",
  components: {
    "http-error-partial": HttpErrorPartial,
    "pet-form": PetForm
  },
  data(): {
    pet?: PetResponse;
    httpError?: HttpError;
  } {
    return {
      pet: undefined,
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
    async fetchPet() {
      const response = await ReadPet(this.$route.params.id);

      if (response instanceof HttpError) {
        this.httpError = response;
      } else {
        this.httpError = undefined;
        this.pet = response;
      }
    },
    async submitPet(pet: PetRequest) {
      const response = await UpdatePet(this.$route.params.id, pet);

      if (response instanceof HttpError) {
        this.httpError = response;
      } else {
        this.httpError = undefined;

        this.$router.push("/pet");
      }
    }
  },
  created(): void {
    this.fetchPet();
  }
});
</script>
