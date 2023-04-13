<template>
  <v-col>
    <v-row>
      <v-col class="d-flex" cols="12" md="4">
        <v-select
          v-model="selectedMetrics"
          :items="metricsList"
          :menu-props="{ maxHeight: '400' }"
          label="Select metrics"
          multiple
          @input="
            () => {
              selectedMetricsTitles = getSelectedMetricsTitles(selectedMetrics);
              fetch();
            }
          "
        >
          <template #selection="{ item, index }">
            <v-chip v-if="index === 0" small>
              <span>{{ item.text }}</span>
            </v-chip>
            <span v-if="index === 1" class="grey--text text-caption">
              (+{{ selectedMetrics.length - 1 }} others)
            </span>
          </template>
        </v-select>
      </v-col>
      <v-col class="d-flex" cols="12" md="4">
        <v-menu ref="menu" :close-on-content-click="false" close-on-click>
          <template #activator="{ on, attrs }">
            <v-text-field
              :value="dates.join(' - ')"
              label="Select dates"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="dates"
            range
            :max="getFormattedDate(new Date())"
            :min="dates.length === 1 ? dates[0] : ''"
            @input="fetch()"
          />
        </v-menu>
      </v-col>
      <v-col class="d-flex" cols="12" md="4">
        <v-select
          v-model="selectedType"
          :items="CHART_TYPES"
          label="Select type"
        />
      </v-col>
    </v-row>
    <v-row class="align-center">
      <v-col class="d-flex" cols="12" md="2">
        Switch color:
      </v-col>
      <v-col
        v-for="title in selectedMetricsTitles"
        :key="title"
        class="d-flex"
        cols="12"
        md="2"
      >
        <v-menu :ref="title" :close-on-content-click="false" close-on-click>
          <template #activator="{ on, attrs }">
            <v-btn color="primary" text v-bind="attrs" v-on="on">
              {{ title }}
            </v-btn>
          </template>
          <v-color-picker
            v-model="selectedColors[title]"
            @input="
              chartConfig.series.find((item) => item.name === title).color =
                selectedColors[title]
            "
          />
        </v-menu>
      </v-col>
      <v-col class="d-flex" cols="12" md="2">
        <v-menu ref="background" :close-on-content-click="false" close-on-click>
          <template #activator="{ on, attrs }">
            <v-btn color="primary" text v-bind="attrs" v-on="on">
              Background
            </v-btn>
          </template>
          <v-color-picker
            v-model="selectedColors.background"
            @input="
              chartConfig.chart.backgroundColor = selectedColors.background
            "
          />
        </v-menu>
      </v-col>
    </v-row>
    <v-row v-if="showChart">
      <v-col class="d-flex" cols="12">
        <highchart class="highcharts-container" :options="chartConfig" />
      </v-col>
    </v-row>
    <v-row v-else class="justify-center">
      <v-alert
        dense
        outlined
        type="error"
      >
        Can't get data.
      </v-alert>
    </v-row>
  </v-col>
</template>

<script>
import { useFetch, ref, useStore } from '@nuxtjs/composition-api'
import { useApi } from '~/api'
import { useCharts, useDates } from '~/utils'

export default {
  name: 'WeatherChart',
  props: {
    chartDefaultMetric: {
      type: String,
      default: 'temperature_2m'
    }
  },
  setup (props) {
    const store = useStore()
    const metricsList = store.state.metricsList

    const { getWeatherData } = useApi()
    const { CHART_TYPES, COLORS, getSelectedMetricsTitles, getChartConfig } = useCharts()
    const { getCurrentDate, getSameDateWeekAgo, getFormattedDate } = useDates()

    const dates = ref([getSameDateWeekAgo(), getCurrentDate()])
    const selectedType = ref('line')
    const selectedMetrics = ref([props.chartDefaultMetric])
    const selectedMetricsTitles = ref(getSelectedMetricsTitles([props.chartDefaultMetric]))
    const chartConfig = ref({})
    const showChart = ref(false)
    const selectedColors = ref(COLORS)

    const { fetch } = useFetch(async () => {
      await getWeatherData({
        startDate: dates.value[0],
        endDate: dates.value[1] || dates.value[0],
        metrics: selectedMetrics.value.join(',')
      }).then((result) => {
        chartConfig.value = getChartConfig({ selectedColors: selectedColors.value, type: selectedType, selectedMetrics: selectedMetrics.value, weatherData: result.data })

        showChart.value = true
      }).catch(() => {
        showChart.value = false
      })
    })

    return {
      chartConfig,
      dates,
      selectedType,
      CHART_TYPES,
      metricsList,
      selectedMetrics,
      showChart,
      selectedMetricsTitles,
      selectedColors,
      getSelectedMetricsTitles,
      getFormattedDate,
      fetch
    }
  }
}
</script>
<style lang="scss" scoped>
.highcharts-container {
  height: 100%;
  width: 100%;
}
</style>
