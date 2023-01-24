import dayjs from 'dayjs'
import { NextComponentType } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Calendar } from '../../../../../components/Calendar'
import { api } from '../../../../../lib/axios'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'

export const CalendarStep: NextComponentType = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availability, setAvailability] = useState<Date[]>([])

  const router = useRouter()

  const { username } = router.query

  const isDateSelected = !!selectedDate
  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  useEffect(() => {
    if (!selectedDate) {
      return
    }

    const getAvailability = async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: dayjs(selectedDate).format('YYYY-MM-DD'),
        },
      })

      console.log(response.data)
    }
    getAvailability()
  }, [selectedDate, username])

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>08:00h</TimePickerItem>
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
