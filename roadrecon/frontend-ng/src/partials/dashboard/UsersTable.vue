<template>
  <div class="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
    <header v-if="title" class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
      <h2 class="font-semibold text-gray-800 dark:text-gray-100">{{title}}</h2>
      <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
    </header>
    <div class="p-3">

      <!-- Table -->
      <div class="overflow-x-auto">
        <DataTable v-model:filters="filters" filterDisplay="row" :value="values" tableStyle="min-width: 50rem" paginator :rows="50" :rowsPerPageOptions="[50, 100, 200, 1000]" :globalFilterFields="filterFields">
          <template #header>
              <div class="flex justify-end">
                  <IconField>
                      <InputIcon>
                          <i class="pi pi-search" />
                      </InputIcon>
                      <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                  </IconField>
              </div>
          </template>
          <Column sortable v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" style="width: 25%"></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default {
  name: 'UsersTable',
  props: {
    columns: {
      type: Array,
      required: true, // Array of column names (or object keys)
    },
    values: {
      type: Array,
      required: true, // Array of objects to display
    },
    filterFields: {
      type: Array,
      required: false, // Array of column names (or object keys)
    },
    filters: {
      type: Object,
      required: false, // Array of column names (or object keys)
    },
  },
}
</script>