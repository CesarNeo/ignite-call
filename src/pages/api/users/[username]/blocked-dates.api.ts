import { NextApiHandler } from 'next'
import { prisma } from '../../../../lib/prisma'

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { username, year, month } = req.query

  if (!year || !month) {
    return res.status(400).json({ error: 'Year or month not specified' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username: username as string,
    },
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((day) => {
    return !availableWeekDays.some(
      (availableDay) => availableDay.week_day === day,
    )
  })

  return res.json({ blockedWeekDays })
}

export default handler
