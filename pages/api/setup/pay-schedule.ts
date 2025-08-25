import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';

/**
 * POST /api/setup/pay-schedule
 * body: { cadence: 'WEEKLY'|'BIWEEKLY'|'SEMIMONTHLY'|'MONTHLY', anchorDate: string (ISO), defaultNetPay: number }
 * For now, we use single demo user 'demo'.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { cadence, anchorDate, defaultNetPay } = req.body;
  const userId = 'demo';

  // Ensure the user exists
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, name: 'Demo User' }
  });

  const exists = await prisma.paySchedule.findFirst({ where: { userId } });
  if (exists) {
    const updated = await prisma.paySchedule.update({
      where: { id: exists.id },
      data: { cadence, anchorDate: new Date(anchorDate), defaultNetPay }
    });
    return res.json(updated);
  }

  const created = await prisma.paySchedule.create({
    data: { userId, cadence, anchorDate: new Date(anchorDate), defaultNetPay }
  });
  res.json(created);
}
