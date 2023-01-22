import { NextComponentType } from 'next'
import { Calendar } from '../../../../../components/Calendar'
import { Container } from './styles'

export const CalendarStep: NextComponentType = () => {
  return (
    <Container>
      <Calendar />
    </Container>
  )
}
