import axios from 'axios'
export function useApi () {
  const baseUrl = 'https://archive-api.open-meteo.com/v1/archive'

  const getWeatherData = (params) => {
    const { startDate, endDate, metrics } = params

    return axios.get(baseUrl, {
      params: {
        latitude: '62.60',
        longitude: '29.76',
        start_date: startDate,
        end_date: endDate,
        hourly: metrics
      }
    })
  }

  return { getWeatherData }
}
