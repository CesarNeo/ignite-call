import dayjs from 'dayjs'
import { NextComponentType } from 'next'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useMemo, useState } from 'react'
import { getWeekDays } from '../../utils/get-week-days'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles'

const SHORT_WEEK_DAYS = getWeekDays({ short: true })

export const Calendar: NextComponentType = () => {
  const [currentDate, setCurrentDate] = useState(() => dayjs().set('date', 1))

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')
  const calendarWeeks = useMemo(() => {
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, index) => currentDate.set('date', index + 1))

    const firstWeekDayOfMonth = currentDate.get('day')
    const previousMonthFillArray = Array.from({
      length: firstWeekDayOfMonth,
    })
      .map((_, index) => {
        return currentDate.subtract(index + 1, 'day')
      })
      .reverse()

    return [...previousMonthFillArray, ...daysInMonthArray]
  }, [currentDate])
  console.log(
    '🚀 ~ file: index.tsx:29 ~ calendarWeeks ~ calendarWeeks',
    calendarWeeks,
  )

  const handlePreviousMonth = () => {
    const previousMonthDate = currentDate.subtract(1, 'month')

    setCurrentDate(previousMonthDate)
  }

  const handleNextMonth = () => {
    const nextMonthDate = currentDate.add(1, 'month')

    setCurrentDate(nextMonthDate)
  }

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button
            type="button"
            onClick={handlePreviousMonth}
            title="Previous month"
          >
            <CaretLeft />
          </button>

          <button type="button" onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {SHORT_WEEK_DAYS.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay>2</CalendarDay>
            </td>
            <td>
              <CalendarDay>3</CalendarDay>
            </td>
          </tr>
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
