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
      <div class="grid gap-6 rounded-3xl overflow-auto">
        <ObjectTable :columns="columns" :values="approles" :filterFields="filterFields" :filters="filters" />
      </div>
    </div>
  </main>
</template>

<script>
import ObjectTable from '../partials/dashboard/ObjectTable.vue'
import { FilterMatchMode } from '@primevue/core/api';
import axios from 'axios'

export default {
  name: 'ApplicationRoles',
  props: {
    name: String
  },
  components: {
    ObjectTable
  },
  data(){
    return {
      approles: [],
      columns: [
        { field: 'pname', header: 'Principal Name' },
        { field: 'ptype', header: 'Principal Type' },
        { field: 'app', header: 'Application' },
        { field: 'value', header: 'Role' },
        { field: 'desc', header: 'Description' },
      ],
      filterFields:["pname","ptype","app","value","desc"],
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    }
  },
  mounted() {
    axios
        .get("/api/approles")
        .then(response => {
            this.approles=response.data;
        })
        .catch(error => {
            console.log(error)
      })
  }
}
</script>