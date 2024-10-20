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
        <Card v-if="this.policies">
          <template class="flex flex-col" #content>
            <div>
                <DataTable :value="policies" @row-click="goToDetail">
                  <Column header="Enabled">
                    <template #body="policy">
                      <Tag v-if="policy.data.policyDetail.State == 'Enabled'" severity="success" value="Enabled" />
                      <Tag v-if="policy.data.policyDetail.State == 'Disabled'" severity="danger" value="Disabled" />
                    </template>
                  </Column>
                  <Column field="displayName" header="Name">
                    <template #body="policy">
                        {{ policy.data.displayName }}
                    </template>
                  </Column>
                </DataTable>
            </div>
          </template>
        </Card>
        <Card v-else>
          <template class="flex flex-col" #content>
            <p>No policies</p>
          </template>
        </Card>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, toRaw } from 'vue'
import { FilterMatchMode } from '@primevue/core/api';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import axios from 'axios'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional

const filters = ref();

export default {
  name: 'Policies',
  props: {
    name: String,
  },
  components: {
    DataTable,
    Tag,
    Card,
    Column,
    ColumnGroup,
    Row
  },
  data() {
    return {
      policies: [],
      columns: [
        { field: 'appliesTo', header: 'Applies to' },
        { field: 'applications', header: 'Applications' },
        { field: 'onPlatforms', header: 'On platforms' },
        { field: 'controls', header: 'Controls' },
        { field: 'policyDetail.Version', header: 'Version' },
      ],
      filterFields: ["displayName"],
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    }
  },
  mounted() {
    axios
      .get("/api/policies")
      .then(response => {
        console.log(response.data)
        for(var i=0;i<response.data.length;i++){
          if(response.data[i].policyType == 18){
            this.policies.push({
              displayName: response.data[i].displayName,
              policyDetail: JSON.parse(response.data[i].policyDetail[0]),
              objectId: response.data[i].objectId
            })
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    goToDetail(event) {
      this.$router.push({ name: 'RowDetail', params: { objectId: event.data.objectId, objectType: "Policy" } });
    }
  },
}
</script>