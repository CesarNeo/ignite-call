import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { username, date } = req.query

  if (!date) {
    return res.status(400).json({ error: 'Missing date' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username: username as string,
    },
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const referenceDate = dayjs(date as string)
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return res.json({ availability: [] })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({ availability: [] })
  }

  const {
    time_start_in_minutes: timeStartInMinutes,
    time_end_in_minutes: timeEndInMinutes,
  } = userAvailability
  const startHour = timeStartInMinutes / 60
  const endHour = timeEndInMinutes / 60

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, index) => {
      return startHour + index
    },
  )

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  const availableTimes = possibleTimes.filter((possibleTime) => {
    return !blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === possibleTime,
    )
  })

  return res.json({ possibleTimes, availableTimes })
}

export default handler
