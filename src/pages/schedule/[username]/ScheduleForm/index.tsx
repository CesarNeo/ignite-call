import { FunctionComponent, useCallback, useState } from 'react'
import { CalendarStep } from './CalendarStep'
import { ConfirmStep } from './ConfirmStep'

export const ScheduleForm: FunctionComponent = () => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)

  const handleClearSelectedDateTime = useCallback(() => {
    setSelectedDateTime(null)
  }, [])

  if (selectedDateTime) {
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onCancelCorfirmation={handleClearSelectedDateTime}
      />
    )
  }

  return <CalendarStep onSelectDateTime={setSelectedDateTime} />
}
