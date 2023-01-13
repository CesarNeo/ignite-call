export const convertTimeStringToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}
