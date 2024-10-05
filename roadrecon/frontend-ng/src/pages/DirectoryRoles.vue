<template>
  <!-- Site header -->
  <main class="grow">
    <div class="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
      <!-- Dashboard actions -->
      <div class="sm:flex sm:justify-between sm:items-center mb-8">

        <!-- Left: Title -->
        <div class="mb-4 sm:mb-0">
          <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">{{ name }}</h1>
        </div>
      </div>
      <!-- Cards -->
      <div class="grid gap-6">
        <ObjectTable :columns="columns" :values="directoryroles" :filterFields="filterFields" :filters="filters" />
      </div>
    </div>
  </main>
</template>

<script>
import { ref, toRaw } from 'vue'
import ObjectTable from '../partials/dashboard/ObjectTable.vue'
import { FilterMatchMode } from '@primevue/core/api';
import axios from 'axios'

const filters = ref();

export default {
  name: 'Directoryroles',
  props: {
    name: String
  },
  components: {
    ObjectTable
  },
  data(){
    return {
      directoryroles: [],
      assignments: [],
      columns: [
        { field: 'principal.displayName', header: 'Principal name' },
        { field: '', header: 'Scope' },
        { field: '', header: 'Assignment Type' },
        { field: 'membershipRule', header: 'Principal Type' },
        { field: 'membershipRule', header: 'userPrincipalName' },
        { field: 'membershipRule', header: 'Account type' },
        { field: 'membershipRule', header: 'Status' },
      ],
      filterFields:["displayName","description","membershipRule"],
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    }
  },
  mounted() {
    axios
        .get("/api/administrativeunits")
        .then(response => {
            const directoryroles = response.data

            console.log("API data:", directoryroles)

            this.directoryroles=response.data;
            this.assignments = this.directoryroles.filter(data => data)
            console.log(this.assignments)
        })
        .catch(error => {
            console.log(error)
      })
  }
}
</script>