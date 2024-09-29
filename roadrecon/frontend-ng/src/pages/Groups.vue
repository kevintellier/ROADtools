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
        <ObjectTable :columns="columns" :values="groups" :filterFields="filterFields" :filters="filters" />
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
  name: 'Groups',
  props: {
    name: String
  },
  components: {
    ObjectTable
  },
  data(){
    return {
      mappedUsers: [], // mapped user data
      groups: [],
      columns: [
        { field: 'displayName', header: 'Name' },
        { field: 'description', header: 'Description' },
        { field: 'dirSyncEnabled', header: 'Group type' },
        { field: 'groupTypes', header: 'Group source' },
        { field: 'mail', header: 'Mail' },
        { field: 'isPublic', header: 'Public?' },
        { field: 'isAssignableToRole', header: 'Role assignable?' },
        { field: 'membershipRule', header: 'Dynamic membership' }
      ],
      filterFields:["displayName","description","dirSyncEnabled","groupTypes","mail","isPublic","isAssignableToRole","membershipRule"],
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    }
  },
  mounted() {
    axios
        .get("/api/groups")
        .then(response => {
            const groups = response.data

            console.log("API data:", users)

            this.groups=response.data;
        })
        .catch(error => {
            console.log(error)
      })
  }
}
</script>