import dayjs from 'dayjs';
import { prisma } from './db';

/** Create paychecks for the month using the user's PaySchedule. */
export async function generatePaychecks(userId: string, monthISO: string) {
  const sched = await prisma.paySchedule.findFirst({ where: { userId } });
  if (!sched) throw new Error('No pay schedule found for user');

  const start = dayjs(monthISO).startOf('month');
  const end = start.endOf('month').add(7, 'day'); // small buffer

  // Build a rolling series around the month from the anchor
  const series: { payDate: Date; periodStart: Date; periodEnd: Date }[] = [];
  let d = dayjs(sched.anchorDate);

  const step = (cur: dayjs.Dayjs) => {
    switch (sched.cadence) {
      case 'WEEKLY': return cur.add(1, 'week');
      case 'BIWEEKLY': return cur.add(2, 'week');
      case 'SEMIMONTHLY': return cur.add(15, 'day');
      case 'MONTHLY': return cur.add(1, 'month');
      default: return cur.add(2, 'week');
    }
  };

  while (d.isBefore(end.add(35, 'day'))) {
    const next = step(d);
    series.push({ payDate: d.toDate(), periodStart: d.toDate(), periodEnd: next.toDate() });
    d = next;
  }

  // Recreate only the paychecks that fall in the month window
  await prisma.paycheck.deleteMany({
    where: { userId, payDate: { gte: start.toDate(), lt: end.toDate() } }
  });

  for (const c of series) {
    if (dayjs(c.payDate).isBefore(start) || dayjs(c.payDate).isAfter(end)) continue;
    await prisma.paycheck.create({
      data: {
        userId,
        payDate: c.payDate,
        periodStart: c.periodStart,
        periodEnd: c.periodEnd,
        netPayCents: (await prisma.paySchedule.findFirst({ where: { userId } }))!.defaultNetPay
      }
    });
  }
}

/** Make bill occurrences for the month and assign each to its covering paycheck. */
export async function forecastMonth(userId: string, monthISO: string) {
  const start = dayjs(monthISO).startOf('month');
  const end = start.endOf('month');

  // Clear and recreate this month's bill occurrences
  await prisma.billOccurrence.deleteMany({
    where: { bill: { userId }, dueDate: { gte: start.toDate(), lte: end.toDate() } }
  });

  const bills = await prisma.bill.findMany({ where: { userId, active: true } });
  for (const b of bills) {
    const due = b.dueDay ? start.date(b.dueDay) : start.endOf('month');
    await prisma.billOccurrence.create({
      data: { billId: b.id, dueDate: due.toDate(), amountCents: b.amountCents, status: 'FORECAST' }
    });
  }

  const checks = await prisma.paycheck.findMany({ where: { userId }, orderBy: { payDate: 'asc' } });
  const occ = await prisma.billOccurrence.findMany({
    where: { bill: { userId }, dueDate: { gte: start.toDate(), lte: end.toDate() } },
    include: { bill: true }
  });

  // Assign each occurrence to the most recent paycheck before its due date
  for (const o of occ) {
    let assignedId: string | undefined;
    for (let i = checks.length - 1; i >= 0; i--) {
      if (dayjs(checks[i].payDate).isSame(o.dueDate) || dayjs(checks[i].payDate).isBefore(o.dueDate)) {
        assignedId = checks[i].id; break;
      }
    }
    await prisma.billOccurrence.update({ where: { id: o.id }, data: { assignedPayId: assignedId } });
  }

  // Group by paycheck
  const grouped: Record<string, { id: string; name: string; amountCents: number; dueDate: Date }[]> = {};
  for (const o of await prisma.billOccurrence.findMany({
    where: { bill: { userId }, dueDate: { gte: start.toDate(), lte: end.toDate() } },
    include: { bill: true }
  })) {
    if (!o.assignedPayId) continue;
    if (!grouped[o.assignedPayId]) grouped[o.assignedPayId] = [];
    grouped[o.assignedPayId].push({ id: o.id, name: o.bill.name, amountCents: o.amountCents, dueDate: o.dueDate });
  }

  const paychecks = await prisma.paycheck.findMany({
    where: { userId, payDate: { gte: start.toDate(), lte: end.add(7, 'day').toDate() } },
    orderBy: { payDate: 'asc' }
  });

  const withTotals = paychecks.map(p => {
    const items = grouped[p.id] || [];
    const assignedTotal = items.reduce((s, x) => s + x.amountCents, 0);
    return { ...p, assignedTotal, left: p.netPayCents - assignedTotal };
  });

  return { paychecks: withTotals, groups: grouped };
}
