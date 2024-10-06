<template>
    <!-- Site header -->
    <main class="grow">
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
            <!-- Dashboard actions -->
            <div class="sm:flex sm:justify-between sm:items-center mb-8">
                <!-- Left: Title -->
                <div class="mb-4 sm:mb-0">
                    <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">{{ object.displayName }}</h1>
                    <Tag v-if="(object.objectType == 'User' || object.objectType == 'Device') && object.accountEnabled === true" severity="success" value="Enabled"/>
                    <Tag v-if="(object.objectType == 'User' || object.objectType == 'Device') && object.accountEnabled === false" severity="danger" value="Disabled"/>
                </div>
            </div>
            <!-- Cards -->
            <div class="grid grid-cols-2 gap-4 overflow-auto rounded-3xl p-3">
                <Card class="grid grid-cols-2">
                    <template #content>
                        <DataView :value="object">
                            <template #list="slotProps">
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
                                            <div class="flex flex-col">
                                                <div>
                                                    <div v-for="(item,index) in object.overviewItems" class="p-4" :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                                                        <div class="grid grid-cols-4 justify-items-stretch">
                                                            <div class="justify-self-start gap-2 ">
                                                                <div class="text-lg font-semibold font-medium mt-2">{{ item.name }}</div>
                                                            </div>
                                                            <div class="justify-self-start gap-8 col-span-2">
                                                                <span class="text-lg">{{ item.value }}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel value="1">
                                            <div class="overflow-x-auto">
                                                <pre id="code" class="text-gray-300">
                                                    <code>
                                                        {{ rawObject }}
                                                    </code>
                                                </pre>
                                            </div>
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </template>
                        </DataView>
                    </template>
                </Card>
                <Card v-if="object.tabItems.length > 0">
                    <template #content>
                        <Tabs value="0" class="rounded">
                            <TabList>
                                <Tab v-for="item in object.tabItems" :key="item.name" :value="item.value">
                                    {{ item.name }}
                                    <Tag v-if="item && item.attribute" severity="info" :value="object[item.attribute].length"></Tag>
                                </Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel v-for="item in object.tabItems" :key="item.attribute" :value="item.value">
                                    <ObjectTable :columns="item.columns" :values="object[item.attribute]" :filterFields="item.filterFields"
                                        :filters="filters" />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </template>
                </Card>
            </div>
        </div>
    </main>
</template>

<script>
import { ref, toRaw } from 'vue'
import ObjectTable from '../partials/dashboard/ObjectTable.vue'
import { FilterMatchMode } from '@primevue/core/api';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import axios from 'axios'
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import DataView from 'primevue/dataview';

const filters = ref();

export default {
    name: 'RowDetail',
    components: {
        ObjectTable,
        Card,
        Tab,
        Tag,
        Tabs,
        TabList,
        TabPanels,
        TabPanel,
        DataView,
        FilterMatchMode,
    },
    data() {
        return {
            object: {
                memberOfRole: [],
                tabItems: []
            },
            name: "User detail",
            rawObject: null
        };
    },
    mounted() {
        const objectId = this.$route.params.objectId;
        const objectType = this.$route.params.objectType;

        var apiRoute = ""

        if (objectType === "User"){
            apiRoute = "users"
        }
        else if(objectType === "Group"){
            apiRoute = "groups"
        }
        else if(objectType === "Device"){
            apiRoute = "devices"
        }
        else if(objectType === "Application"){
            apiRoute = "applications"
        }

        axios
            .get(`/api/${apiRoute}/${objectId}`)
            .then(response => {
                this.rawObject = JSON.parse(JSON.stringify(response.data))//Deep copy to ensure its not bound to this.object
                this.object = response.data;
                
                if (objectType === "User") {
                    this.object.tabItems = [
                        { 
                            name: "Role Membership",
                            attribute: "memberOfRole",
                            value: "0",
                            filterFields: ["displayName", "description"],
                            columns: [
                                { field: 'displayName', header: 'Name' },
                                { field: 'description', header: 'Description' },
                            ],
                        },
                        { 
                            name: "Group Membership",
                            attribute: "memberOf",
                            value: "1",
                            filterFields: ["displayName", "description"],
                            columns: [
                                { field: 'displayName', header: 'Name' },
                                { field: 'description', header: 'Description' },
                            ],
                        }
                    ];
                    this.object.overviewItems = [
                        { 
                            name: "Display name",
                            value: this.object.displayName,
                        },
                        { 
                            name: "UserPrincipalName",
                            value: this.object.userPrincipalName,
                        },
                        { 
                            name: "ObjectId",
                            value: this.object.objectId,
                        },
                        { 
                            name: "Last password change",
                            value: this.object.lastPasswordChangeDateTime,
                        },
                        { 
                            name: "Account source",
                            value: this.object.dirSyncEnabled ? "Synced with AD" : "Cloud-only",
                        },
                        { 
                            name: "Account type",
                            value: this.object.userType,
                        },
                        { 
                            name: "Creation date",
                            value: this.object.createdDateTime,
                        },
                        { 
                            name: "Creation date",
                            value: this.object.createdDateTime,
                        },
                    ];
                }
                else if (objectType === "Group") {
                    this.object.tabItems = [
                        { 
                            name: "Owner users",
                            attribute: "ownerUsers",
                            value: "0",
                            filterFields: ["displayName", "userPrincipalName","accountEnabled"],
                            columns: [
                                { field: 'displayName', header: 'Name' },
                                { field: 'userPrincipalName', header: 'userPrincipalName' },
                                { field: 'accountEnabled', header: 'Enabled' },
                            ],
                        },
                        { 
                            name: "Member users",
                            attribute: "memberUsers",
                            value: "1",
                            filterFields: ["displayName", "userPrincipalName","accountEnabled"],
                            columns: [
                                { field: 'displayName', header: 'Name' },
                                { field: 'userPrincipalName', header: 'userPrincipalName' },
                                { field: 'accountEnabled', header: 'Enabled' },
                            ],
                        },
                        { 
                            name: "Member ServicePrincipal",
                            attribute: "memberServicePrincipals",
                            value: "2",
                            filterFields: ["displayName", "userPrincipalName","accountEnabled"],
                            columns: [
                                { field: 'displayName', header: 'Name' },
                                { field: 'userPrincipalName', header: 'userPrincipalName' },
                                { field: 'accountEnabled', header: 'Enabled' },
                            ],
                        },
                        { 
                            name: "Member devices",
                            attribute: "memberDevices",
                            value: "3",
                            filterFields: ["displayName", "userPrincipalName","accountEnabled"],
                            columns: [
                                { field: 'displayName', header: 'Name' },
                                { field: 'userPrincipalName', header: 'userPrincipalName' },
                                { field: 'accountEnabled', header: 'Enabled' },
                            ],
                        },
                    ];
                    this.object.overviewItems = [
                        { 
                            name: "Display name",
                            value: this.object.displayName,
                        },
                        { 
                            name: "Description",
                            value: this.object.description,
                        },
                        { 
                            name: "ObjectId",
                            value: this.object.objectId,
                        },
                        { 
                            name: "Can be assigned to roles",
                            value: this.object.lastPasswordChangeDateTime,
                        },
                        { 
                            name: "Created",
                            value: this.object.createdDateTime,
                        },
                        { 
                            name: "Group source",
                            value: this.object.groups ? "Synced with AD" : "Cloud-only",
                        },
                    ];
                }
                else if (objectType === "Device") {
                    this.object.tabItems = [
                        { 
                            name: "Owners",
                            attribute: "owner",
                            value: "0",
                            filterFields: ["name","userPrincipalName","accountEnabled"],
                            columns: [
                                { field: 'name', header: 'Owner' },
                                { field: 'userPrincipalName', header: 'userPrincipalName' },
                                { field: 'accountEnabled', header: 'Enabled' }
                            ],
                        },
                    ];
                    this.object.overviewItems = [
                        { 
                            name: "Display name",
                            value: this.object.displayName,
                        },
                        { 
                            name: "ObjectId",
                            value: this.object.objectId,
                        },
                        { 
                            name: "Device ID",
                            value: this.object.deviceId,
                        },
                        { 
                            name: "Device OS Version",
                            value: this.object.deviceOSVersion,
                        },
                        { 
                            name: "Device OS Type",
                            value: this.object.deviceOSType,
                        },
                    ];
                }
                else if (objectType === "Application") {
                    this.object.tabItems = [
                    ];
                    this.object.overviewItems = [
                        { 
                            name: "Display name",
                            value: this.object.displayName,
                        },
                        { 
                            name: "ObjectId",
                            value: this.object.objectId,
                        },
                        { 
                            name: "Application ID",
                            value: this.object.applicationId,
                        },
                        { 
                            name: "Publisher",
                            value: this.object.publisher,
                        },
                        { 
                            name: "Homepage",
                            value: this.object.homepage,
                        },
                        { 
                            name: "Service Principal",
                            value: this.object.ownerServicePrincipals[0],
                        },
                    ];
                }
            })
            .catch(error => {
                console.log(error);
            });
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