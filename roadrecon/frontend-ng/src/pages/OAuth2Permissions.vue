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
      <div class="grid gap-6 overflow-auto rounded-3xl">
        <ObjectTable :columns="columns" :values="oauth2permissions" :filterFields="filterFields" :filters="filters" />
      </div>
    </div>
  </main>
</template>

<script>
import ObjectTable from '../partials/dashboard/ObjectTable.vue'
import { FilterMatchMode } from '@primevue/core/api';
import axios from 'axios'

export default {
  name: 'OAuth2Permissions',
  props: {
    name: String
  },
  components: {
    ObjectTable
  },
  data(){
    return {
      oauth2permissions: [],
      columns: [
        { field: 'type', header: 'Approval type' },
        { field: 'userdisplayname', header: 'Principal Name' },
        { field: 'sourceapplication', header: 'Source Application (permissions recipient)' },
        { field: 'targetapplication', header: 'Target Application (permission to access)' },
        { field: 'scope', header: 'Scope (permissions)' },
        { field: 'expiry', header: 'Expiry' },
      ],
      filterFields:["type","userdisplayname","sourceapplication","targetapplication","scope","expiry","keyCredentials","appRoles","oauth2Permissions","ownerUsers"],
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    }
  },
  mounted() {
    axios
        .get("/api/oauth2permissions")
        .then(response => {
            this.oauth2permissions=response.data;
        })
        .catch(error => {
            console.log(error)
      })
  }
}
</script>