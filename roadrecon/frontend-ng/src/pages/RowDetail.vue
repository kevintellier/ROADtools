<template>
    <!-- Site header -->
    <main class="grow">
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
            <!-- Dashboard actions -->
            <div class="sm:flex sm:justify-between sm:items-center mb-8">
                <!-- Left: Title -->
                <div class="mb-4 sm:mb-0">
                    <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">{{ object.displayName }}</h1>
                    <Tag v-if="(object.objectType == 'User' || object.objectType == 'Device'|| object.objectType == 'ServicePrincipal') && object.accountEnabled === true" severity="success" value="Enabled"/>
                    <Tag v-if="(object.objectType == 'User' || object.objectType == 'Device'|| object.objectType == 'ServicePrincipal') && object.accountEnabled === false" severity="danger" value="Disabled"/>
                </div>
            </div>
            <!-- Cards -->
            <div class="grid grid-cols-2 gap-4 overflow-auto rounded-3xl p-3">
                <Card class="grid grid-cols-2 overflow-auto">
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
                                                        <div class="grid grid-rows-2 justify-items-stretch">
                                                            <div class="justify-self-start gap-2 row-span-2">
                                                                <div class="text-xl font-black font-medium mt-2">{{ item.name }}</div>
                                                            </div>
                                                            <template v-if="Array.isArray(item.value)">
                                                                <div class="justify-self-start">
                                                                    <span v-for="value in item.value" class="text-lg">
                                                                        {{ value }}<br>
                                                                    </span>
                                                                </div>
                                                            </template>
                                                            <template v-else>
                                                                <div class="justify-self-start">
                                                                    <span class="text-lg">{{ item.value }}</span>
                                                                </div>
                                                            </template>
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
                <!-- TODO Add check here -->
                <Card v-if="activeTabItems.length > 0">
                    <template #content>
                        <Tabs value="0" class="rounded">
                            <TabList>
                                <template v-for="(item,tabIndex) in activeTabItems" :key="item.name">
                                    <Tab :value="String(tabIndex)" v-if="object[item.attribute].length">
                                        {{ item.name }}
                                        <Tag v-if="item && item.attribute" severity="info" :value="object[item.attribute].length"></Tag>
                                    </Tab>
                                </template>
                            </TabList>
                            <TabPanels>
                                <template v-for="(item,tabIndex) in activeTabItems" :key="item.attribute">
                                    <TabPanel :value="String(tabIndex)" v-if="object[item.attribute].length" >
                                        <ObjectTable :columns="item.columns" :values="object[item.attribute]" :filterFields="item.filterFields"
                                                :filters="filters" />
                                    </TabPanel>
                                </template>
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
                tabItems: [],
            },
            activeTabItems: [],
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
        else if(objectType === "ServicePrincipal"){
            apiRoute = "serviceprincipals"
        }

        axios
            .get(`/api/${apiRoute}/${objectId}`)
            .then(response => {
                this.rawObject = JSON.parse(JSON.stringify(response.data))//Deep copy to ensure its not bound to this.object
                this.object = response.data;
                this.object.activeTabItems = []
                
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
                            name: "Devices",
                            attribute: "ownedDevices",
                            value: "1",
                            filterFields: ["displayName"],
                            columns: [
                                { field: 'displayName', header: 'Name' },
                                { field: 'accountEnabled', header: 'Enabled' },
                                { field: 'deviceManufacturer', header: 'Manufacturer' },
                                { field: 'deviceModel', header: 'Model' },
                                { field: 'deviceOSType', header: 'OS' },
                                { field: 'deviceOSVersion', header: 'OS Version' },
                                { field: 'deviceTrustType', header: 'Trust type' },
                                { field: 'isCompliant', header: 'Compliant' },
                                { field: 'isManaged', header: 'Managed' },
                                { field: 'isRooted', header: 'Rooted' },
                            ],
                        },
                        { 
                            name: "ServicePrincipals",
                            attribute: "ownedServicePrincipals",
                            value: "2",
                            filterFields: ["displayName"],
                            columns: [
                                { field: 'displayName', header: 'Name' },
                                { field: 'publisherName', header: 'Publisher' },
                                { field: 'microsoftFirstParty', header: 'Microsoft app' },
                                { field: 'passwordCredentials', header: 'Passwords' },
                                { field: 'keyCredentials', header: 'Keys' },
                                { field: 'appRoles', header: 'Roles defined' },
                                { field: 'oauth2Permissions', header: 'OAuth2 Permissions' },
                                { field: 'ownerUsers', header: 'Custom owner' },
                            ],
                        },
                        { 
                            name: "Applications",
                            attribute: "ownedApplications",
                            value: "3",
                            filterFields: ["displayName"],
                            columns: [
                                { field: 'displayName', header: 'Name' },
                                { field: 'passwordCredentials', header: 'Passwords' },
                                { field: 'keyCredentials', header: 'Keys' },
                                { field: 'appRoles', header: 'Roles defined' },
                                { field: 'oauth2Permissions', header: 'OAuth2 Permissions' },
                                { field: 'appRoles', header: 'Custom owner' },
                                { field: 'oauth2Permissions', header: 'OAuth2 Permissions' },
                                { field: 'ownerUsers', header: 'Custom owner' },
                            ],
                        },
                        { 
                            name: "Group Membership",
                            attribute: "memberOf",
                            value: "4",
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
                else if (objectType === "ServicePrincipal") {
                    this.object.tabItems = [
                        { 
                            name: "App defined permissions (app permissions)",
                            attribute: "appRoles",
                            value: "0",
                            filterFields: ["value","displayName","description","id","allowedMemberTypes"],
                            columns: [
                                { field: 'value', header: 'Value' },
                                { field: 'displayName', header: 'Name' },
                                { field: 'description', header: 'Description' },
                                { field: 'id', header: 'ID' },
                                { field: 'allowedMemberTypes', header: 'Allowed types' },
                            ],
                        },
                        { 
                            name: "OAuth2 permissions (delegated permissions)",
                            attribute: "oauth2Permissions",
                            value: "1",
                            filterFields: ["value","displayName","description","id","allowedMemberTypes"],
                            columns: [
                                { field: 'value', header: 'Value' },
                                { field: 'userConsentDisplayName', header: 'User Consent Name' },
                                { field: 'userConsentDescription', header: 'User Consent Description' },
                                { field: 'adminConsentDisplayName', header: 'Admin Consent Name' },
                                { field: 'adminConsentDescription', header: 'Admin Consent Description' },
                                { field: 'id', header: 'Admin Consent Description' },
                                { field: 'type', header: 'Allowed types' },
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
                            name: "Application ID",
                            value: this.object.appId,
                        },
                        { 
                            name: "Publisher",
                            value: this.object.publisherName,
                        },
                        { 
                            name: "ReplyUrls",
                            value: this.object.replyUrls,
                        },
                    ];
                }
                
                this.object.nbItems = 0

                for (var i = 0; i < this.object.tabItems.length; i++) {
                    if(this.object[this.object.tabItems[i].attribute].length > 0){
                        this.activeTabItems.push(this.object.tabItems[i])
                    }
                }
                console.log(this.object.activeTabItems)
            })
            .catch(error => {
                console.log(error);
            });
    },
    methods: {
        processTabItems() {
            if (this.object && this.object.tabItems) {
                console.log('Now processing tab items:', this.object.tabItems);
                // Do whatever you need to with this.object.tabItems here
            }
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