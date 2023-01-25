import dayjs from 'dayjs'
import { NextApiHandler } from 'next'
import { z } from 'zod'
import { prisma } from '../../../../lib/prisma'

const CREATE_SCHEDULING_BODY = z.object({
  name: z.string(),
  email: z.string().email(),
  observations: z.string().optional(),
  date: z.string().datetime(),
})

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { username } = req.query

  const user = await prisma.user.findUnique({
    where: {
      username: username as string,
    },
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const { name, email, observations, date } = CREATE_SCHEDULING_BODY.parse(
    req.body,
  )

  const schedulingDate = dayjs(date).startOf('hour')

  if (schedulingDate.isBefore(new Date())) {
    return res.status(400).json({ error: 'Date is in the past' })
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  })

  if (conflictingScheduling) {
    return res.status(400).json({ error: 'Scheduling already exists' })
  }

  await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
      user_id: user.id,
    },
  })

  return res.status(201).end()
}

export default handler
