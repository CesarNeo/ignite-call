import { NextComponentType } from 'next'
import { CaretLeft, CaretRight } from 'phosphor-react'
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
  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          Dezembro <span>2023</span>
        </CalendarTitle>

        <CalendarActions>
          <button type="button">
            <CaretLeft />
          </button>

          <button type="button">
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