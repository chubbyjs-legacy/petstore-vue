<template>
  <div v-if="petList || httpError">
    <http-error-partial v-if="httpError" :http-error="httpError" />
    <h1>List Pets</h1>
    <div v-if="petList">
      <router-link v-if="petList._links.create" to="/pet/create" class="btn-green mb-4">Create</router-link>
      <pet-filter-form
        :submitPetFilter="submitPetFilter"
        :defaultPetFilters="query.filters"
        :badRequest="badRequest"
      />
      <table class="my-4">
        <thead>
          <tr>
            <th>Id</th>
            <th>CreatedAt</th>
            <th>UpdatedAt</th>
            <th>
              Name (&nbsp;
              <router-link :to="sortLink('name', 'asc')" data-testid="sort-pet-name-asc">A-Z</router-link>&nbsp;|
              <router-link :to="sortLink('name', 'desc')" data-testid="sort-pet-name-asc">Z-A</router-link>&nbsp;|
              <router-link :to="sortLink('name', undefined)" data-testid="sort-pet-name-asc">---</router-link>&nbsp;)
            </th>
            <th>Tag</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pet in petList._embedded.items" :key="pet.id">
            <td>{{pet.id}}</td>
            <td>{{dateFormat(pet.createdAt)}}</td>
            <td>{{dateFormat(pet.updatedAt)}}</td>
            <td>{{pet.name}}</td>
            <td>{{pet.tag}}</td>
            <td>
              <router-link v-if="pet._links.read" :to="`/pet/${pet.id}`" class="btn-gray mr-4">Read</router-link>
              <router-link
                v-if="pet._links.update"
                :to="`/pet/${pet.id}/update`"
                class="btn-gray mr-4"
              >Update</router-link>
              <button v-if="pet._links.delete" v-on:click="deletePet(pet.id)" class="btn-red">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <pagination
        :currentPage="query.page"
        :totalPages="totalPages"
        :maxPages="7"
        :submitPage="changePage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { de } from "date-fns/locale";
import { format } from "date-fns";
import { ListPets, DeletePet } from "../../../ApiClient/Pet";
import { Route } from "vue-router";
import BadRequest from "../../../Model/Error/BadRequest";
import HttpError from "../../../Model/Error/HttpError";
import HttpErrorPartial from "../../Partial/HttpError.vue";
import Pagination from "../../Partial/Pagination.vue";
import PetFilterForm from "../../Form/PetFilterForm.vue";
import PetFilters from "../../../Model/Pet/PetFilters";
import PetList from "../../../Model/Pet/PetList";
import qs from "qs";

type query = {
  page: number;
  filters: object;
  sort: object;
};

export default Vue.extend({
  name: "PetList",
  components: {
    "http-error-partial": HttpErrorPartial,
    "pet-filter-form": PetFilterForm,
    pagination: Pagination
  },
  data(): {
    query: query;
    petList?: PetList;
    httpError?: HttpError;
  } {
    return {
      query: {
        page: 1,
        filters: {},
        sort: {}
      },
      petList: undefined,
      httpError: undefined
    };
  },
  computed: {
    badRequest(): BadRequest | undefined {
      if (this.httpError instanceof BadRequest) {
        return this.httpError;
      }

      return undefined;
    },
    queryString(): string {
      return qs.stringify({
        limit: 10,
        offset: this.query.page * 10 - 10,
        filters: this.query.filters,
        sort: this.query.sort
      });
    },
    totalPages(): number {
      if (!this.petList) {
        return 1;
      }

      return Math.ceil(this.petList.count / this.petList.limit);
    }
  },
  methods: {
    updateQuery(route: Route): void {
      const searchStart = route.fullPath.search(/\?/);
      const search =
        searchStart !== -1 ? route.fullPath.substring(searchStart) : "";
      const query = qs.parse(search.substr(1));

      query.page = parseInt(query.page ? query.page : "1");
      query.filters = query.filters ? query.filters : {};
      query.sort = query.sort ? query.sort : {};

      this.query = query;
    },
    dateFormat(date: string): string {
      if (!date) {
        return "";
      }

      return format(Date.parse(date), "dd.MM.yyyy - HH:mm:ss", { locale: de });
    },
    sortLink(field: string, order?: string) {
      return `/pet?${qs.stringify({
        ...this.query,
        sort: { ...this.query.sort, [field]: order }
      })}`;
    },
    async fetchPetList() {
      const response = await ListPets(this.queryString);

      if (response instanceof HttpError) {
        this.httpError = response;
      } else {
        this.httpError = undefined;
        this.petList = response;
      }
    },
    async deletePet(id: string) {
      const deleteResponse = await DeletePet(id);

      if (deleteResponse instanceof HttpError) {
        this.httpError = deleteResponse;

        return;
      }

      this.httpError = undefined;

      this.fetchPetList();
    },
    changePage(page: number): void {
      this.$router.push(`/pet?${qs.stringify({ ...this.query, page: page })}`);
    },
    submitPetFilter(filters: PetFilters): void {
      this.$router.push(
        `/pet?${qs.stringify({
          ...this.query,
          page: 1,
          filters: filters
        })}`
      );
    }
  },
  created(): void {
    this.updateQuery(this.$route);
    this.fetchPetList();
  },
  watch: {
    $route(to: Route): void {
      this.updateQuery(to);
      this.fetchPetList();
    }
  }
});
</script>
