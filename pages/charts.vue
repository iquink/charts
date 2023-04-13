<template>
  <v-row>
    <v-col cols="12">
      <WeatherChart v-for="metric in chartMetrics" :key="metric" :chart-default-metric="metric" />
    </v-col>
  </v-row>
</template>

<script>
import { computed, useStore } from '@nuxtjs/composition-api'

export default {
  name: 'ChartsPage',
  setup () {
    const store = useStore()

    return { chartMetrics: computed(() => store.state.selectedMetrics) }
  }
}
</script>
