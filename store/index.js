import { reactive } from '@nuxtjs/composition-api'

const state = reactive({
  selectedMetrics: [
    'dewpoint_2m',
    'temperature_2m',
    'cloudcover',
    'windspeed_10m'
  ],
  metricsList: [
    { text: 'temperature', value: 'temperature_2m' },
    { text: 'dewpoint', value: 'dewpoint_2m' },
    { text: 'cloudcover', value: 'cloudcover' },
    { text: 'windspeed', value: 'windspeed_10m' }
  ],
  availableMetricsList: [
    { text: 'temperature', value: 'temperature_2m' },
    { text: 'dewpoint', value: 'dewpoint_2m' },
    { text: 'cloudcover', value: 'cloudcover' },
    { text: 'windspeed', value: 'windspeed_10m' }
  ]
})

const mutations = {
  setSelectedMetrics (state, value) {
    state.selectedMetrics = value

    state.metricsList = state.availableMetricsList
      .filter(elem => value.find(item => item === elem.value))
  }
}

export default {
  state,
  mutations
}
