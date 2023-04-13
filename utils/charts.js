import { useStore } from '@nuxtjs/composition-api'

export function useCharts () {
  const store = useStore()
  const metricsList = store.state.metricsList

  const CHART_TYPES = ['line', 'column']

  const COLORS = {
    temperature: '#EF07EF',
    dewpoint: '#FF2B00',
    cloudcover: '#02FF00',
    windspeed: '#0013FF',
    background: '#FFFFFF'
  }

  const getSelectedMetricsTitles = options => metricsList.filter(item => options.find(elem => elem === item.value)).map(item => item.text)

  const getChartConfig = (options) => {
    const { type, selectedMetrics, weatherData, selectedColors } = options
    const { time, cloudcover, dewpoint_2m: dewpoint, temperature_2m: temperature, windspeed_10m: windspeed } = weatherData.hourly
    const series = []

    if (cloudcover) { series.push({ color: selectedColors.cloudcover, name: 'cloudcover', data: cloudcover }) }
    if (dewpoint) { series.push({ color: selectedColors.dewpoint, name: 'dewpoint', data: dewpoint }) }
    if (temperature) { series.push({ color: selectedColors.temperature, name: 'temperature', data: temperature }) }
    if (windspeed) { series.push({ color: selectedColors.windspeed, name: 'windspeed', data: windspeed }) }

    const title = getSelectedMetricsTitles(selectedMetrics).join(', ') + ' in Joensuu'

    return {
      chart: {
        type,
        backgroundColor: selectedColors.background,
        reflow: true
      },
      title: {
        text: title
      },
      xAxis: {
        categories: time,
        title: {
          text: 'Dates'
        }
      },
      series
    }
  }

  return { getChartConfig, CHART_TYPES, getSelectedMetricsTitles, COLORS }
}
