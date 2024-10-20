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
      <div class="grid gap-6 rounded-3xl overflow-auto">
        <!--Don't know why its 11 -->
        <Accordion :value="['0','11']" multiple expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
          <template v-for="(directoryRole, index) in directoryroles">
            <AccordionPanel :value="String(index)" v-if="directoryRole.assignments.length > 0">
                <AccordionHeader>
                  <span class="flex items-center gap-2 w-full">
                    <span>{{ directoryRole.displayName }}</span>
                    <Tag severity="info" :value="directoryRole.assignments.length"></Tag>
                  </span>
                </AccordionHeader>
                <AccordionContent>
                  <ObjectTable :columns="columns" :values="directoryRole.assignments" :filterFields="filterFields" :filters="filters" />
                </AccordionContent>
            </AccordionPanel>
          </template>
        </Accordion>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, toRaw } from 'vue'
import ObjectTable from '../partials/dashboard/ObjectTable.vue'
import { FilterMatchMode } from '@primevue/core/api';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Tag from 'primevue/tag';
import axios from 'axios'

const filters = ref();

export default {
  name: 'DirectoryRoles',
  props: {
    name: String,
  },
  components: {
    ObjectTable,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    Tag
  },
  data(){
    return {
      directoryroles: [],
      assignments: [],
      columns: [
        { field: 'principal.displayName', header: 'Principal Name' },
        { field: 'scopeNames', header: 'Scope' },
        { field: 'type', header: 'Assignment Type' },
        { field: 'principal.objectType', header: 'Principal Type' },
        { field: 'principal.userPrincipalName', header: 'userPrincipalName' },
        { field: 'principal.dirSyncEnabled', header: 'Account type' },
        { field: 'principal.accountEnabled', header: 'Status' },
      ],
      filterFields:["principal.displayName","scopeNames","type","principal.objectType","principal.userPrincipalName","principal.dirSyncEnabled","principal.accountEnabled"],
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    }
  },
  mounted() {
    axios
        .get("/api/roledefinitions")
        .then(response => {
            this.directoryroles=response.data;
            for(var i=0;i<this.directoryroles.length;i++){
              for(var j=0;j<this.directoryroles[i].assignments.length;j++){
                  this.directoryroles[i].assignments[j].scopeNames = this.directoryroles[i].assignments[j].scopeNames[0]
                  this.directoryroles[i].assignments[j].type = this.directoryroles[i].assignments[j].type == "assignment" ? "Active" : ""
                }
            }
            console.log(this.directoryroles)
        })
        .catch(error => {
            console.log(error)
      })
  }
}
</script>