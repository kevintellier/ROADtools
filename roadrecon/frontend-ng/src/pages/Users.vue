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
        <ObjectTable :columns="columns" :values="users" :filterFields="filterFields" :filters="filters" />
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
  name: 'Users',
  props: {
    name: String
  },
  components: {
    ObjectTable
  },
  data(){
    return {
      mappedUsers: [], // mapped user data
      users: [],
      columns: [
        { field: 'displayName', header: 'Name' },
        { field: 'userPrincipalName', header: 'UserPrincipalName' },
        { field: 'accountEnabled', header: 'Enabled' },
        { field: 'mail', header: 'Email' },
        { field: 'department', header: 'Department' },
        { field: 'lastPasswordChangeDateTime', header: 'Last password change' },
        { field: 'jobTitle', header: 'Job title' },
        { field: 'mobile', header: 'Mobile' },
        { field: 'objectType', header: 'Account type' },
        { field: 'member', header: 'User type' },
      ],
      filterFields:["displayName","accountEnabled","mail","department","lastPasswordChangeDateTime","jobTitle","mobile","objectType","member"],
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    }
  },
  mounted() {
    axios
        .get("/api/users")
        .then(response => {
            this.users=response.data;
            for(var i=0;i<this.users.length;i++){
              this.users[i].accountEnabled = this.users[i].accountEnabled ? "True" : "False"
            }
        })
        .catch(error => {
            console.log(error)
      })
  }
}
</script>