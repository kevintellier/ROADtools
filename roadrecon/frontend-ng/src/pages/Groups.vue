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
        <ObjectTable 
        :columns="columns" 
        :values="groups" 
        :filterFields="filterFields" 
        :filters="filters" 
        :totalRecords
        :loading
        @pageChange="fetchData"
        @inputTextUpdated="fetchData"
        @pageSort="fetchData"
        />
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
        { field: 'groupType', header: 'Group type' },
        { field: 'source', header: 'Group source' },
        { field: 'mail', header: 'Mail' },
        { field: 'public', header: 'Public?' },
        { field: 'roleAssignable', header: 'Role assignable?' },
        { field: 'membershipRule', header: 'Dynamic membership' }
      ],
      filterFields:["displayName","description","groupType","source","mail","public","roleAssignable","membershipRule"],
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      totalRecords: 0,
      loading: false
    }
  },
  mounted() {
    this.fetchData({page:1,rows:50,sortedField:"displayName",sortOrder:-1})
  },
  methods: {
    fetchData(params) {
      this.loading = true
      axios
        .get(`/api/groups`,{params:params})
        .then(response => {
            this.groups=response.data.items;
            this.totalRecords=response.data.total;
            
            for(var i=0;i<this.groups.length;i++){
              this.groups[i].source = this.groups[i].dirSyncEnabled ? "Synced with AD" : "Cloud-only"
              this.groups[i].groupType = this.groups[i].groupTypes.includes("Unified") ? "Microsoft 365" : "Security"
              this.groups[i].public = this.groups[i].isPublic ? "True" : ""
              this.groups[i].roleAssignable = this.groups[i].isAssignableToRole ? "True" : ""
            }
        })
        .catch(error => {
            console.log(error)
      })
      .finally(() => {
          this.loading = false;
      });
    },
  }
}
</script>