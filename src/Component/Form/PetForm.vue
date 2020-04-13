<template>
  <form v-on:submit.prevent="onSubmit">
    <fieldset>
      <text-field
        label="Name"
        v-model="pet.name"
        :invalidParameters="getInvalidParameterByNameDenormalizedByName('name')"
      />
      <text-field
        label="Tag"
        v-model="pet.tag"
        :invalidParameters="getInvalidParameterByNameDenormalizedByName('tag')"
      />
      <div class="form-field">
        <label>Vaccanations</label>
        <div>
          <fieldset v-for="(vaccanation, i) in pet.vaccinations" :key="i">
            <text-field
              label="Name"
              v-model="pet.vaccinations[i]['name']"
              :invalidParameters="getInvalidParameterByNameDenormalizedByName(`vaccinations[${i}].name`)"
            />
            <button
              :data-testid="`remove-vaccination-${i}`"
              type="button"
              v-on:click="removeVaccination(i)"
              class="btn-red"
            >Remove</button>
          </fieldset>
          <button
            data-testid="add-vaccination"
            type="button"
            v-on:click="addVaccination"
            class="btn-green"
          >Add</button>
        </div>
      </div>
      <button type="submit" data-testid="submit-pet" class="btn-blue">Save</button>
    </fieldset>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import InvalidParameterByNameDenormalizer from "../../Denormalizer/InvalidParameterByNameDenormalizer";
import TextField from "./TextField.vue";
import InvalidParameter from "../../Model/Error/InvalidParameter";
import UnprocessableEntity from "../../Model/Error/UnprocessableEntity";
import PetRequest from "../../Model/Pet/PetRequest";
import Vaccination from "../../Model/Pet/Vaccination";
import PetResponse from "../../Model/Pet/PetResponse";

export default Vue.extend({
  name: "PetForm",
  components: {
    "text-field": TextField
  },
  props: {
    submitPet: Function,
    defaultPet: PetResponse,
    unprocessableEntity: UnprocessableEntity
  },
  data(): {
    pet: PetRequest;
  } {
    return {
      pet: new PetRequest({ name: "" })
    };
  },
  computed: {
    invalidParameterByNameDenormalized(): Record<string, Array<InvalidParameter>> {
      return InvalidParameterByNameDenormalizer(
        this.unprocessableEntity
          ? this.unprocessableEntity.invalidParameters
          : []
      );
    }
  },
  methods: {
    onSubmit(): void {
      if ("" === this.pet.tag) {
        this.pet.tag = undefined;
      }

      this.submitPet(this.pet);
    },
    addVaccination(): void {
      this.pet.vaccinations.push(new Vaccination({ name: "" }));
    },
    removeVaccination(i: number): void {
      this.pet.vaccinations.splice(i, 1);
    },
    getInvalidParameterByNameDenormalizedByName(
      name: string
    ): Array<InvalidParameter> {
      return this.invalidParameterByNameDenormalized[name] ?? [];
    }
  },
  created() {
    if (this.defaultPet) {
      this.pet = this.defaultPet;
    }
  }
});
</script>
