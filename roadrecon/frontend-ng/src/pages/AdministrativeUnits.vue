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
        <ObjectTable :columns="columns" :values="administrativeUnits" :filterFields="filterFields" :filters="filters" />
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
  name: 'AdministrativeUnits',
  props: {
    name: String
  },
  components: {
    ObjectTable
  },
  data(){
    return {
      administrativeUnits: [],
      columns: [
        { field: 'displayName', header: 'Name' },
        { field: 'description', header: 'Description' },
        { field: 'membershipRule', header: 'Membership rule' },
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
            const administrativeUnits = response.data

            console.log("API data:", administrativeUnits)

            this.administrativeUnits=response.data;
        })
        .catch(error => {
            console.log(error)
      })
  }
}
</script>