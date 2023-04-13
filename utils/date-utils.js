const currentDate = new Date()

const getFormattedDate = (date) => {
  return date.toISOString().substr(0, 10)
}

export function useDates () {
  const getSameDateWeekAgo = () => {
    const daysCount = 7
    const millisecondsInDay = 86400000 // 24 hours x 60 minutes x 60 seconds x 1000 milliseconds

    return getFormattedDate(new Date(currentDate.getTime() - (daysCount * millisecondsInDay)))
  }

  const getCurrentDate = () => getFormattedDate(currentDate)

  return { getSameDateWeekAgo, getCurrentDate, getFormattedDate }
}
