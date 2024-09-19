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
        <UsersTable :columns="columns" :rows="users" />
      </div>
    </div>
  </main>
</template>

<script>
import { ref } from 'vue'
import UsersTable from '../partials/dashboard/UsersTable.vue';
import axios from 'axios'

export default {
  name: 'Users',
  props: {
    name: String
  },
  components: {
    UsersTable
  },
  data(){
    return {
      users: {},
      columns: [
        "Name",
        "UserPrincipalName",
        "Enabled",
        "Email",
        "Department",
        "Last password change",
        "Job title",
        "Mobile",
        "Account source",
        "Account type"
      ]
    }
  },
  mounted() {
    axios
      .get("/api/users")
      .then(response => {
        const {displayName, accountEnabled} = response.data
        this.users = {displayName, accountEnabled}
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      console.log("Users:")
      console.log(this.users)
  }
}
</script>