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

        <!-- Right: Actions -->
        <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">

          <!-- Filter button -->
          <FilterButton align="right" />
          <!-- Datepicker built with flatpickr -->
          <Datepicker align="right" />
        </div>

      </div>
      <!-- Cards -->
      <div class="grid grid-cols-12 gap-6">
      </div>
    </div>
  </main>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Service Principals',
  components: {
  },
  props: {
    name: String
  },
  setup() {
  }
}
</script>