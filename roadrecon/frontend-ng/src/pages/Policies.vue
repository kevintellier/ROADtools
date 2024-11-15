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
      <div class="grid gap-6 rounded-3xl overflow-auto" v-if="!loading">
        <!--Don't know why its 11 -->
        <Accordion multiple expandIcon="pi pi-plus" collapseIcon="pi pi-minus" v-if="policies">
          <template v-for="(policy, index) in policies">
            <AccordionPanel :value="String(index)">
              <AccordionHeader>
                <span class="flex items-center gap-2 w-full">
                  <Tag :severity="policy.policyDetail.State == 'Enabled' ? 'success' :
                    policy.policyDetail.State == 'Disabled' ? 'danger' :
                      'info'" :value="policy.policyDetail.State">
                  </Tag>
                  <span>{{ policy.displayName }}</span>
                </span>
              </AccordionHeader>
              <AccordionContent v-if="policy.policyDetail.Conditions">
                <Tabs value="0" class="rounded">
                  <TabList>
                    <Tab value="0">
                      Overview
                    </Tab>
                    <Tab value="1">
                      Raw
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel value="0">
                      <div v-if="policy.policyDetail.Conditions.Users">
                        <span class="pi pi-user"></span>
                        <span class="text-surface-500 dark:text-surface-300 text-lg font-semibold m-4">Users</span>
                        <div class="flex flex-wrap">
                          <div class="flex-1 m-4 p-tag-success p-4 rounded-2xl"
                            v-if="policy.policyDetail.Conditions.Users.Include">
                            <div
                              class="card bg-surface-0 dark:bg-surface-900 text-surface-500 dark:text-surface-300 flex justify-between !rounded-2xl">
                              <div class="overview-info">
                                <div class="m-0 mb-1 text-surface-500 dark:text-surface-300 text-lg font-semibold">
                                  Including
                                </div>
                                <ul v-for="(item, index) in policy.policyDetail.Conditions.Users.Include[0]"
                                  class="m-0 text-surface-500 dark:text-surface-300 font-semibold ml-4">
                                  <li v-for="element in item">
                                    <p v-if="index == 'Groups'">In group {{ element.displayName }}</p>
                                    <p v-if="index == 'Users'">User(s) {{ element.displayName }}</p>
                                    <p v-if="index == 'GuestsOrExternalUsers'">Guests or External Users : {{ element }}
                                    </p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div class="flex-1 m-4 p-tag-danger p-4 rounded-2xl"
                            v-if="policy.policyDetail.Conditions.Users.Exclude">
                            <div
                              class="card bg-surface-0 dark:bg-surface-900 text-surface-500 dark:text-surface-300 flex justify-between !rounded-2xl">
                              <div class="overview-info">
                                <div class="m-0 mb-1 text-surface-500 dark:text-surface-300 text-lg font-semibold">
                                  Excluding
                                </div>
                                <ul v-for="(item, index) in policy.policyDetail.Conditions.Users.Exclude[0]"
                                  class="m-0 text-surface-500 dark:text-surface-300 font-semibold ml-4">
                                  <li v-for="element in item">
                                    <p v-if="index == 'Groups'">In group {{ element.displayName }}</p>
                                    <p v-if="index == 'Users'">User(s) {{ element.displayName }}</p>
                                    <p v-if="index == 'GuestsOrExternalUsers'">Guests or External Users : {{ element }}
                                    </p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-if="policy.policyDetail.Conditions.Applications">
                        <span class="pi pi-box"></span>
                        <span class="text-surface-500 dark:text-surface-300 text-lg font-semibold m-4"
                          v-if="policy.policyDetail.Conditions.Applications">Applications</span>
                        <div class="flex flex-wrap" v-if="policy.policyDetail.Conditions.Applications">
                          <div class="flex-1 m-4 p-tag-success p-4 rounded-2xl"
                            v-if="policy.policyDetail.Conditions.Applications.Include">
                            <div
                              class="card bg-surface-0 dark:bg-surface-900 text-surface-500 dark:text-surface-300 flex justify-between !rounded-2xl">
                              <div class="overview-info">
                                <div class="m-0 mb-1 text-surface-500 dark:text-surface-300 text-lg font-semibold">
                                  Including
                                </div>
                                <ul v-for="(item, index) in policy.policyDetail.Conditions.Applications.Include[0]"
                                  class="m-0 text-surface-500 dark:text-surface-300 font-semibold ml-4">
                                  <li v-for="element in item">
                                    <p v-if="index == 'Applications'">Application(s) {{ element.displayName }}</p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div class="flex-1 m-4 p-tag-danger p-4 rounded-2xl"
                            v-if="policy.policyDetail.Conditions.Applications.Exclude">
                            <div
                              class="card bg-surface-0 dark:bg-surface-900 text-surface-500 dark:text-surface-300 flex justify-between !rounded-2xl">
                              <div class="overview-info">
                                <div class="m-0 mb-1 text-surface-500 dark:text-surface-300 text-lg font-semibold">
                                  Excluding
                                </div>
                                <ul v-for="(item, index) in policy.policyDetail.Conditions.Applications.Exclude[0]"
                                  class="m-0 text-surface-500 dark:text-surface-300 font-semibold ml-4">
                                  <li v-for="element in item">
                                    <p v-if="index == 'Applications'">Application(s) {{ element.displayName }}</p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-if="policy.policyDetail.Conditions.ClientTypes">
                        <span class="pi pi-mobile"></span>
                        <span class="text-surface-500 dark:text-surface-300 text-lg font-semibold m-4">Client
                          types</span>
                        <div class="flex flex-wrap" v-if="policy.policyDetail.Conditions.ClientTypes">
                          <div class="flex-1 m-4 p-tag-success p-4 rounded-2xl"
                            v-if="policy.policyDetail.Conditions.ClientTypes.Include">
                            <div
                              class="card bg-surface-0 dark:bg-surface-900 text-surface-500 dark:text-surface-300 flex justify-between !rounded-2xl">
                              <div class="overview-info">
                                <div class="m-0 mb-1 text-surface-500 dark:text-surface-300 text-lg font-semibold">
                                  Including
                                </div>
                                <ul v-for="(item, index) in policy.policyDetail.Conditions.ClientTypes.Include[0]"
                                  class="m-0 text-surface-500 dark:text-surface-300 font-semibold ml-4">
                                  <li v-for="element in item">
                                    <p v-if="index == 'ClientTypes'">ClientTypes {{ element }}</p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div class="flex-1 m-4 p-tag-danger p-4 rounded-2xl"
                            v-if="policy.policyDetail.Conditions.ClientTypes.Exclude">
                            <div
                              class="card bg-surface-0 dark:bg-surface-900 text-surface-500 dark:text-surface-300 flex justify-between !rounded-2xl">
                              <div class="overview-info">
                                <div class="m-0 mb-1 text-surface-500 dark:text-surface-300 text-lg font-semibold">
                                  Excluding
                                </div>
                                <ul v-for="(item, index) in policy.policyDetail.Conditions.ClientTypes.Exclude[0]"
                                  class="m-0 text-surface-500 dark:text-surface-300 font-semibold ml-4">
                                  <li v-for="element in item">
                                    <p v-if="index == 'ClientTypes'">ClientTypes {{ element }}</p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-if="policy.policyDetail.Conditions.DevicePlatforms">
                        <span class="pi pi-desktop"></span>
                        <span class="text-surface-500 dark:text-surface-300 text-lg font-semibold m-4">Devices</span>
                        <div class="flex flex-wrap" v-if="policy.policyDetail.Conditions.DevicePlatforms">
                          <div class="flex-1 m-4 p-tag-success p-4 rounded-2xl"
                            v-if="policy.policyDetail.Conditions.DevicePlatforms.Include">
                            <div
                              class="card bg-surface-0 dark:bg-surface-900 text-surface-500 dark:text-surface-300 flex justify-between !rounded-2xl">
                              <div class="overview-info">
                                <div class="m-0 mb-1 text-surface-500 dark:text-surface-300 text-lg font-semibold">
                                  Including
                                </div>
                                <ul v-for="(item, index) in policy.policyDetail.Conditions.DevicePlatforms.Include[0]"
                                  class="m-0 text-surface-500 dark:text-surface-300 font-semibold ml-4">
                                  <li v-for="element in item">
                                    <p v-if="index == 'DevicePlatforms'">Platform {{ element }}</p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div class="flex-1 m-4 p-tag-danger p-4 rounded-2xl"
                            v-if="policy.policyDetail.Conditions.DevicePlatforms.Exclude">
                            <div
                              class="card bg-surface-0 dark:bg-surface-900 text-surface-500 dark:text-surface-300 flex justify-between !rounded-2xl">
                              <div class="overview-info">
                                <div class="m-0 mb-1 text-surface-500 dark:text-surface-300 text-lg font-semibold">
                                  Excluding
                                </div>
                                <ul v-for="(item, index) in policy.policyDetail.Conditions.DevicePlatforms.Exclude[0]"
                                  class="m-0 text-surface-500 dark:text-surface-300 font-semibold ml-4">
                                  <li v-for="element in item">
                                    <p v-if="index == 'DevicePlatforms'">Platform {{ element }}</p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-if="policy.policyDetail.Controls">
                        <span class="pi pi-check-circle"></span>
                        <span class="text-surface-500 dark:text-surface-300 text-lg font-semibold m-4">Controls</span>
                        <div class="flex flex-wrap">
                          <div class="flex-1 m-4 p-tag-info p-4 rounded-2xl">
                            <div
                              class="card bg-surface-0 dark:bg-surface-900 text-surface-500 dark:text-surface-300 flex justify-between !rounded-2xl">
                              <div class="overview-info">
                                <template v-if="policy.policyDetail.Controls">
                                  <ul v-for="(item, index) in policy.policyDetail.Controls"
                                    class="m-0 text-surface-500 dark:text-surface-300 font-semibold ml-4">
                                    <li v-for="(control) in item.Control">
                                      <p v-if="control != Block">{{ control }}</p>
                                      <p v-else>Deny logon</p>
                                    </li>
                                    <li v-if="item.AuthStrengthIds">
                                      <p>{{ resolve_authstrength(item.AuthStrengthIds) }}</p>
                                    </li>
                                  </ul>
                                </template>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value="1">
                      <pre id="code" class="text-gray-300">
                        <code>
                          {{ policy.raw }}
                        </code>
                      </pre>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </AccordionContent>
            </AccordionPanel>
          </template>
        </Accordion>
        <Card v-else>
          <template class="flex flex-col" #content>
            <p>No policies</p>
          </template>
        </Card>
      </div>
      <div class="grid gap-6 rounded-3xl overflow-auto" v-else>
        <h1 class="text-lg">Loading...</h1>
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
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

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
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    Row,
    Tab,
    Tabs,
    TabList,
    TabPanels,
    TabPanel,
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
      rawObject: {},
      loading: true
    }
  },
  mounted() {
    axios
      .get("/api/policies")
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].policyType == 18) {
            this.policies.push({
              displayName: response.data[i].displayName,
              policyDetail: response.data[i].policyDetail,
              objectId: response.data[i].objectId,
              raw: JSON.parse(JSON.stringify(response.data[i],null,2))
            })
          }
        }
      }).finally(()=>{
        this.loading = false
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    goToDetail(event) {
      this.$router.push({ name: 'RowDetail', params: { objectId: event.data.objectId, objectType: "Policy" } });
    },
    resolve_authstrength(guid){
      var built_in = {
        '00000000-0000-0000-0000-000000000002': 'Multi-factor authentication',
        '00000000-0000-0000-0000-000000000003': 'Passwordless MFA',
        '00000000-0000-0000-0000-000000000004': 'Phishing-resistant MFA'
      }
      return built_in[guid]
    }
  },
}
</script>