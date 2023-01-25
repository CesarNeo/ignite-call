import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { FunctionComponent, useMemo, useState } from 'react'
import { api } from '../../lib/axios'
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

interface CalendarWeek {
  week: number
  days: {
    day: dayjs.Dayjs
    disabled: boolean
  }[]
}

type CalendarWeeks = CalendarWeek[]
interface CalendarProps {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

export const Calendar: FunctionComponent<CalendarProps> = ({
  onDateSelected,
  selectedDate,
}) => {
  const [currentDate, setCurrentDate] = useState(() => dayjs().set('date', 1))

  const router = useRouter()

  const { username } = router.query

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const handlePreviousMonth = () => {
    const previousMonthDate = currentDate.subtract(1, 'month')

    setCurrentDate(previousMonthDate)
  }

  const handleNextMonth = () => {
    const nextMonthDate = currentDate.add(1, 'month')

    setCurrentDate(nextMonthDate)
  }

  const { data: blockedDates } = useQuery<BlockedDates>(
    ['blocked-dates', currentDate.get('year'), currentDate.get('month')],
    async () => {
      const response = await api.get<BlockedDates>(
        `/users/${username}/blocked-dates`,
        {
          params: {
            year: currentDate.get('year'),
            month: currentDate.get('month') + 1,
          },
        },
      )
      return response.data
    },
  )

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }

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

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )
    const lastWeekDayOfMonth = lastDayInCurrentMonth.get('day')
    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDayOfMonth + 1),
    }).map((_, index) => {
      return lastDayInCurrentMonth.add(index + 1, 'day')
    })

    const calendarDays = [
      ...previousMonthFillArray.map((day) => {
        return { day, disabled: true }
      }),
      ...daysInMonthArray.map((day) => {
        return {
          day,
          disabled:
            day.endOf('day').isBefore(new Date()) ||
            blockedDates.blockedWeekDays.includes(day.get('day')) ||
            blockedDates.blockedDates.includes(day.get('date')),
        }
      }),
      ...nextMonthFillArray.map((day) => {
        return { day, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, index, original) => {
        const isNewWeek = index % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: index / 7 + 1,
            days: original.slice(index, index + 7),
          })
        }
        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

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
          {calendarWeeks.map(({ week, days }) => (
            <tr key={week}>
              {days.map(({ day, disabled }) => (
                <td key={day.toString()}>
                  <CalendarDay
                    onClick={() => onDateSelected(day.toDate())}
                    disabled={disabled}
                  >
                    {day.get('date')}
                  </CalendarDay>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
