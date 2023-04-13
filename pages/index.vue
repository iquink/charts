<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6">
        <v-select
          :value="selectedMetrics"
          :items="availableMetricsList"
          :menu-props="{ maxHeight: '400' }"
          label="Select metrics"
          multiple
          @input="(value) => updateMetrics(value)"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          depressed
          color="primary"
          to="charts"
        >
          Go to charts
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { computed, useStore } from '@nuxtjs/composition-api'

export default {
  name: 'IndexPage',
  setup () {
    const store = useStore()

    const updateMetrics = (item) => {
      store.commit('setSelectedMetrics', item)
    }

    return {
      selectedMetrics: computed(() => store.state.selectedMetrics),
      availableMetricsList: computed(() => store.state.availableMetricsList),
      updateMetrics
    }
  }
}
</script>
