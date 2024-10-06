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
        <ObjectTable :columns="columns" :values="devices" :filterFields="filterFields" :filters="filters" />
      </div>
    </div>
  </main>
</template>

<script>
import ObjectTable from '../partials/dashboard/ObjectTable.vue'
import { FilterMatchMode } from '@primevue/core/api';
import axios from 'axios'

export default {
  name: 'Devices',
  props: {
    name: String
  },
  components: {
    ObjectTable
  },
  data(){
    return {
      devices: [],
      columns: [
        { field: 'displayName', header: 'Name' },
        { field: 'deviceManufacturer', header: 'Manufacturer' },
        { field: 'accountEnabled', header: 'Enabled' },
        { field: 'deviceModel', header: 'Model' },
        { field: 'deviceOSType', header: 'OS' },
        { field: 'deviceOSVersion', header: 'OS Version' },
        { field: 'deviceTrustType', header: 'Trust type' },
        { field: 'isCompliant', header: 'Compliant' },
        { field: 'isManaged', header: 'Managed' },
        { field: 'isRooted', header: 'Rooted' },
      ],
      filterFields:["displayName","deviceManufacturer","accountEnabled","deviceModel","deviceOSType","deviceOSVersion","deviceTrustType","isCompliant","isManaged","isRooted"],
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    }
  },
  mounted() {
    axios
        .get("/api/devices")
        .then(response => {
            this.devices=response.data;
        })
        .catch(error => {
            console.log(error)
      })
  }
}
</script>