<template>
  <div class="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
    <header v-if="title" class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
      <h2 class="font-semibold text-gray-800 dark:text-gray-100">{{ title }}</h2>
    </header>
    <div>
      <!-- Table -->
      <div class="overflow-x-auto">
        <DataTable 
          paginator
          resizableColumns
          columnResizeMode="fit"
          :paginatorPosition="paginatorPosition" 
          :rows="rowsPerPageOptions[0]" 
          :lazy="lazy" 
          selectionMode="single" 
          tableStyle="min-width: 50rem"
          v-model:filters="filters" 
          :value="values" 
          :loading="loading"
          :rowsPerPageOptions="rowsPerPageOptions" 
          :globalFilterFields="filterFields" 
          :totalRecords="totalRecords"
          @row-click="handleRowClick" 
          @page="pageChange" 
          @sort="sortPage" 
          class="selectable-text">
          <template #header>
            <div class="flex">
              <IconField v-if="!noSearch">
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="filters['global'].value" placeholder="Global Search.."
                  @update:modelValue="inputTextUpdated" />
              </IconField>
              <MultiSelect 
                v-model="selectedColumns" 
                :options="columns" 
                optionLabel="header" 
                display="chip" 
                placeholder="Select Columns" 
              />
              <span v-if="totalRecords" class="pl-3 self-center text-gray-400">
                {{ totalRecords.toLocaleString('fr-FR') }} results
              </span>
            </div>
          </template>
          <template #empty> No data found. </template>
          <template #loading> Loading data. Please wait. </template>
          <template v-for="col of selectedColumns" :key="col.field">
            <Column 
              :sortable="true" 
              :sortField="col.field" 
              :field="col.field" 
              :header="col.header" 
              style="width: 10%" 
              class="selectable-text">
              <template v-if="col.isTag" #body="slotProps">
                <Tag 
                  :value="slotProps.data[col.field]" 
                  :severity="slotProps.data[col.field] == col.tagSuccessValue || String(slotProps.data[col.field]).toLowerCase() === 'true' ? 'success' : 'danger'" 
                />
              </template>
            </Column>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .selectable-text {
    user-select: text;
  }
</style>

<script>
import { ref } from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from '@primevue/core/api';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Tag from 'primevue/tag';

export default {
  name: 'ObjectTable',
  data() {
    return {
      page: 0,
      rows: 50,
      sortedField: "",
      sortOrder: 0,
      selectedColumns: this.columns // Initialize with all columns
    }
  },
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
      required: false
    },
    totalRecords: {
      type: Number,
      required: false
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
    noSearch: {
      type: Boolean,
      required: false,
      default: false
    },
    lazy: {
      type: Boolean,
      required: false,
      default: true
    },
    rowsPerPageOptions: {
      type: Array,
      required: false,
      default: () => [50, 100, 200, 1000]
    },
    sortedField: {
      type: String,
      required: false
    },
    paginatorPosition: {
      type: String,
      required: false
    },
    sortOrder: {
      type: Number,
      required: false
    },
    tagFields: {
      type: Array,
      required: false
    }
  },
  components: {
    InputText,
    InputIcon,
    IconField,
    FilterMatchMode,
    Column,
    DataTable,
    Tag,
    MultiSelect
  },
  methods: {
    onToggle(val) {
      this.selectedColumns = this.columns.filter(col => val.includes(col));
    },
    handleRowClick(event) {
      const selection = window.getSelection().toString();
      if (!selection) {
        this.goToDetail(event);
      }
    },
    goToDetail(event) {
      if(event.data.principal){
        this.$router.push({ name: 'RowDetail', params: { objectId: event.data.principal.objectId, objectType: event.data.principal.objectType } });
      }
      else if(event.data.consentType == "user"){
        this.$router.push({ name: 'RowDetail', params: { objectId: event.data.userid, objectType: "User" } });
      }
      else{
        this.$router.push({ name: 'RowDetail', params: { objectId: event.data.objectId, objectType: event.data.objectType } });
      }
    },
    pageChange(event) {
      this.page = event.page
      this.rows = event.rows

      var params = { 
        page: this.page + 1,
        rows: this.rows,
        search: this.filters.global.value,
        sortedField: this.sortedField,
        sortOrder: this.sortOrder
      }
      this.$emit('pageChange', params)
    },
    sortPage(event){
      this.sortedField = event.sortField
      this.sortOrder = event.sortOrder

      var params = { 
        page: this.page + 1, 
        rows: this.rows,
        search: this.filters.global.value,
        sortedField: this.sortedField,
        sortOrder: this.sortOrder
      }
      this.$emit('pageSort', params)
    },
    inputTextUpdated(){
      var params = { 
        page: this.page + 1, 
        rows: this.rows,
        sortedField: this.sortedField,
        sortOrder: this.sortOrder
      }

      // Limits search to 3 characters minimum for performance
      if(this.filters.global.value.length >= 3){
        params.search = this.filters.global.value
      }
      
      this.$emit('inputTextUpdated', params)
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