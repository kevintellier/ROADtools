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
        <ObjectTable :columns="columns" :values="applications" :filterFields="filterFields" :filters="filters" />
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
  name: 'Applications',
  props: {
    name: String
  },
  components: {
    ObjectTable
  },
  data(){
    return {
      applications: [],
      columns: [
        { field: 'displayName', header: 'Name' },
        { field: 'availableToOtherTenants', header: 'Multitenant' },
        { field: 'homepage', header: 'Homepage' },
        { field: 'publicClient', header: 'OAuth2 public client' },
        { field: 'oauth2AllowImplicitFlow', header: 'OAuth2 implicit flow' },
        { field: 'passwordCredentials', header: 'Passwords' },
        { field: 'keyCredentials', header: 'Keys' },
        { field: 'appRoles', header: 'Roles defined' },
        { field: 'oauth2Permissions', header: 'OAuth2 Permissions' },
        { field: 'ownerUsers', header: 'Custom owner' },
      ],
      filterFields:["displayName","availableToOtherTenants","homepage","publicClient","oauth2AllowImplicitFlow","passwordCredentials","keyCredentials","appRoles","oauth2Permissions","ownerUsers"],
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    }
  },
  mounted() {
    axios
        .get("/api/applications")
        .then(response => {
            this.applications=response.data;
            for(var i=0;i<this.applications.length;i++){
              this.applications[i].availableToOtherTenants = this.applications[i].availableToOtherTenants ? "True" : ""
              this.applications[i].oauth2AllowImplicitFlow = this.applications[i].oauth2AllowImplicitFlow ? "True" : ""
              this.applications[i].publicClient = this.applications[i].publicClient ? "True" : ""
              this.applications[i].passwordCredentials = this.applications[i].passwordCredentials.toString()
              this.applications[i].keyCredentials = this.applications[i].keyCredentials.toString()
              this.applications[i].appRoles = this.applications[i].appRoles.toString()
              this.applications[i].oauth2Permissions = this.applications[i].oauth2Permissions.toString()
              this.applications[i].ownerUsers = this.applications[i].ownerUsers.length > 0 ? "True" : ""
            }
            console.log(this.applications)
        })
        .catch(error => {
            console.log(error)
      })
  }
}
</script>