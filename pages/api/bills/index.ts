import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = 'demo';

  try {
    // Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, name: 'Demo User' }
    });

    if (req.method === 'GET') {
      const bills = await prisma.bill.findMany({ where: { userId }, orderBy: { name: 'asc' } });
      return res.json(bills);
    }

    if (req.method === 'POST') {
      const { name, category, amountCents, dueDay } = req.body ?? {};
      if (!name || typeof amountCents !== 'number') {
        return res.status(400).json({ error: 'name and amountCents required' });
      }
      const bill = await prisma.bill.create({
        data: {
          userId,
          name: name.trim(),
          category: (category ?? 'General').trim(),
          amountCents: Number(amountCents),
          dueDay: dueDay === null || dueDay === '' || dueDay === undefined ? null : Number(dueDay),
          recurrence: 'MONTHLY'
        }
      });
      return res.status(201).json(bill);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e:any) {
    return res.status(400).json({ error: e?.message || String(e) });
  }
}
