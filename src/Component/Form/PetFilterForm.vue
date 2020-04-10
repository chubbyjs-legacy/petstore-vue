<template>
  <form v-on:submit.prevent="onSubmit">
    <fieldset>
      <text-field
        label="Name"
        v-model="petFilters.name"
        :invalidParameters="getInvalidParameterByNameDenormalizedByName('name')"
      />
      <button data-testid="submit-pet-filter" class="btn-blue">Filter</button>
    </fieldset>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import InvalidParameterByNameDenormalizer from "@/Denormalizer/InvalidParameterByNameDenormalizer";
import TextField from "@/Component/Form/TextField.vue";
import InvalidParameter from "../../Model/Error/InvalidParameter";
import PetFilters from "../../Model/Pet/PetFilters";
import BadRequest from "../../Model/Error/BadRequest";

export default Vue.extend({
  name: "PetFilterForm",
  components: {
    "text-field": TextField
  },
  props: {
    submitPetFilter: Function,
    defaultPetFilters: Object,
    badRequest: BadRequest
  },
  data(): {
    petFilters: PetFilters;
  } {
    return {
      petFilters: new PetFilters({ name: "" })
    };
  },
  computed: {
    invalidParameterByNameDenormalized(): Record<string, any> {
      return InvalidParameterByNameDenormalizer(
        this.badRequest ? this.badRequest.invalidParameters : []
      );
    }
  },
  methods: {
    onSubmit(): void {
      if ("" === this.petFilters.name) {
        this.petFilters.name = undefined;
      }

      this.submitPetFilter(this.petFilters);
    },
    getInvalidParameterByNameDenormalizedByName(
      name: string
    ): Array<InvalidParameter> {
      return this.invalidParameterByNameDenormalized[name] ?? [];
    }
  },
  created() {
    if (this.defaultPetFilters) {
      this.petFilters = this.defaultPetFilters;
    }
  }
});
</script>
