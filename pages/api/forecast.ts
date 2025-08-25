import type { NextApiRequest, NextApiResponse } from 'next';
import { generatePaychecks, forecastMonth } from '../../lib/forecast';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = 'demo';
  const { month } = req.query;
  const m = typeof month === 'string' ? month : new Date().toISOString();
  await generatePaychecks(userId, m);
  const data = await forecastMonth(userId, m);
  res.json(data);
}
