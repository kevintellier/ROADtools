<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />
    <!-- Content area -->
    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <router-view :key="$route.fullPath"/>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import Sidebar from './partials/Sidebar.vue'
import Header from './partials/Header.vue'
import { useDark } from "@vueuse/core";


export default {
  name: 'App',
  components: {
    Sidebar,
    Header,
  },
  setup() {

    const sidebarOpen = ref(false)

    const isDark = useDark({
      selector: 'html',
    })

    return {
      sidebarOpen,
      isDark
    }  
  }
}
</script>

