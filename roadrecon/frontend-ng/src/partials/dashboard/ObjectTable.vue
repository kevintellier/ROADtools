<template>
  <div class="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
    <header v-if="title" class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
      <h2 class="font-semibold text-gray-800 dark:text-gray-100">{{ title }}</h2>
    </header>
    <div class="p-3">

      <!-- Table -->
      <div class="overflow-x-auto">
        <DataTable v-model:filters="filters" :value="values" selectionMode="single" tableStyle="min-width: 50rem" paginator :rows="50"
          :rowsPerPageOptions="[50, 100, 200, 1000]" :globalFilterFields="['displayName']" @row-click="goToDetail">
          <template #header>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Global Search.." />
            </IconField>
          </template>
          <template #empty> No data found. </template>
          <template #loading> Loading data. Please wait. </template>
          <template v-for="col of columns" :key="col.field">
            <Column sortable :sortField="col.field" :field="col.field" :header="col.header" style="width: 10%">
            </Column>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from '@primevue/core/api';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';

export default {
  name: 'ObjectTable',
  props: {
    columns: {
      type: Array,
      required: true, // Array of column names (or object keys)
    },
    values: {
      type: Array,
      required: true, // Array of objects to display
    }
  },
  components: {
    InputText,
    InputIcon,
    IconField,
    FilterMatchMode,
    Column,
    DataTable
  },
  methods:{
    goToDetail($event) {
      this.$router.push({ name: 'RowDetail', params: { objectId: this.values[$event.index].objectId, objectType: this.values[$event.index].objectType } });
    }
  },
  setup() {
    const filters = ref({
      global: { 
        value: null, 
        matchMode: FilterMatchMode.CONTAINS
      },
    });

    return {
      filters,
    };
  }
}
</script>