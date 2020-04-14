<template>
  <div v-if="pet || httpError">
    <http-error-partial v-if="httpError" :httpError="httpError" />
    <h1>Read Pet</h1>
    <div v-if="pet">
      <dl>
        <dt>Id</dt>
        <dd>{{pet.id}}</dd>
        <dt>CreatedAt</dt>
        <dd>{{dateFormat(pet.createdAt)}}</dd>
        <dt>UpdatedAt</dt>
        <dd>{{dateFormat(pet.updatedAt)}}</dd>
        <dt>Name</dt>
        <dd>{{pet.name}}</dd>
        <dt>Tag</dt>
        <dd>{{pet.tag}}</dd>
        <dt>Vaccinations</dt>
        <dd>
          <ul v-if="pet.vaccinations.length > 0">
            <li v-for="(vaccination, i) in pet.vaccinations" :key="i">{{vaccination.name}}</li>
          </ul>
        </dd>
      </dl>
      <router-link to="/pet" class="btn-gray mb-4">List</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { de } from "date-fns/locale";
import { format } from "date-fns";
import { ReadPet } from "../../../ApiClient/Pet";
import HttpError from "../../../Model/Error/HttpError";
import PetResponse from "../../../Model/Pet/PetResponse";
import HttpErrorPartial from "../../Partial/HttpError.vue";

export default Vue.extend({
  name: "PetRead",
  components: {
    "http-error-partial": HttpErrorPartial
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
  methods: {
    dateFormat(date: string): string {
      if (!date) {
        return "";
      }

      return format(Date.parse(date), "dd.MM.yyyy - HH:mm:ss", { locale: de });
    },
    async fetchPet() {
      const response = await ReadPet(this.$route.params.id);

      if (response instanceof HttpError) {
        this.httpError = response;
      } else {
        this.httpError = undefined;
        this.pet = response;
      }
    }
  },
  created(): void {
    this.fetchPet();
  }
});
</script>
