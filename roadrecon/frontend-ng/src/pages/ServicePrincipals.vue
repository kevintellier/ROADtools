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
        <ObjectTable :columns="columns" :values="serviceprincipals" :filterFields="filterFields" :filters="filters" />
      </div>
    </div>
  </main>
</template>

<script>
import { ref } from 'vue'
import ObjectTable from '../partials/dashboard/ObjectTable.vue'
import { FilterMatchMode } from '@primevue/core/api';
import axios from 'axios'

const filters = ref();

export default {
  name: 'ServicePrincipals',
  props: {
    name: String
  },
  components: {
    ObjectTable
  },
  data(){
    return {
      serviceprincipals: [],
      columns: [
        { field: 'accountEnabled', header: 'Enabled' },
        { field: 'appDisplayName', header: 'Name' },
        { field: 'servicePrincipalType', header: 'Type' },
        { field: 'publisherName', header: 'Publisher' },
        { field: 'microsoftFirstParty', header: 'Microsoft app' },
        { field: 'passwordCredentials', header: 'Passwords' },
        { field: 'keyCredentials', header: 'Keys' },
        { field: 'appRoles', header: 'Roles defined' },
        { field: 'oauth2Permissions', header: 'OAuth2 Permissions' },
        { field: 'ownerUsers', header: 'Custom owner' },
      ],
      filterFields:["accountEnabled","appDisplayName","servicePrincipalType","publisherName","microsoftFirstParty","passwordCredentials","keyCredentials","appRoles","oauth2Permissions","ownerUsers"],
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    }
  },
  mounted() {
    axios
        .get("/api/serviceprincipals")
        .then(response => {
            this.serviceprincipals=response.data;
            for(var i=0;i<this.serviceprincipals.length;i++){
              this.serviceprincipals[i].accountEnabled = this.serviceprincipals[i].accountEnabled ? "Enabled" : "Disabled"
              this.serviceprincipals[i].microsoftFirstParty = this.serviceprincipals[i].microsoftFirstParty ? "True" : "False"
              this.serviceprincipals[i].passwordCredentials = this.serviceprincipals[i].passwordCredentials.length > 0 ? "True" : ""
              this.serviceprincipals[i].keyCredentials = this.serviceprincipals[i].keyCredentials.length > 0 ? "True" : ""
              this.serviceprincipals[i].appRoles = this.serviceprincipals[i].appRoles.length > 0 ? this.serviceprincipals[i].appRoles.length : ""
              this.serviceprincipals[i].oauth2Permissions = this.serviceprincipals[i].oauth2Permissions.length > 0 ? this.serviceprincipals[i].oauth2Permissions.length : ""
              this.serviceprincipals[i].ownerUsers = this.serviceprincipals[i].ownerUsers.length > 0 ? "True" : ""
            }
            console.log(this.serviceprincipals)
        })
        .catch(error => {
            console.log(error)
      })
  }
}
</script>