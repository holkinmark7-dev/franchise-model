import { TAX_REGIMES } from '../data/taxRegimes';
import { STARTUP_CATEGORIES } from '../data/staff';
import { MONTH_SHORT } from '../data/seasonality';

const MKT_CURVE = [1,.9,.82,.75,.68,.6,.52,.45,.4,.35,.32,.30,.28,.27,.26,.25,.25,.25,.25,.25,.25,.25,.25,.25];

const r = n => Math.round(n);

export function calcModel({
  g, baseCheck, baseTraffic, cogs, upsellPct, staff, schools,
  regime, patentAnnual, dirSalary, fotMSP,
  startMonth, seasonality, growthSpeed, plateauMonth
}) {
  const rg = TAX_REGIMES.find(rx => rx.id === regime) || TAX_REGIMES[0];
  const fotR = fotMSP ? 0.22 : rg.fotRate;
  const check = baseCheck * g.checkK;
  const maxTraffic = baseTraffic * g.trafficK;

  // Инвестиции
  const franchiseFee = g.franchise * schools;
  const startupBase = STARTUP_CATEGORIES.reduce((s, cat) => s + cat.items.reduce((a, [name, q, p]) => {
    if (name.includes("Аренда")) return a + g.rent * 2;
    return a + q * p;
  }, 0), 0);
  const inv = (franchiseFee + startupBase) * schools;

  let cum = -inv;
  let payback = null;
  const months = [];

  // ФОТ: разделение на основной и административный
  const adminStaff = staff.filter(s => s.admin);
  const coreStaff = staff.filter(s => !s.admin);

  for (let i = 0; i < 24; i++) {
    const calMonth = (startMonth - 1 + i) % 12;
    const seasonK = seasonality[calMonth];

    // S-curve: логистическая кривая роста
    const growthK = 1 / (1 + Math.exp(-growthSpeed * (i + 1 - plateauMonth / 2)));

    // Клиенты
    const clientsPerDay = maxTraffic * growthK * seasonK;
    const clientsMonth = r(clientsPerDay * 30) * schools;

    // Выручка
    const mainRev = clientsMonth * check;
    const upsell = mainRev * (upsellPct / 100);
    const oneTime = mainRev * 0.03;
    const totalRev = mainRev + upsell + oneTime;

    // Расходы
    const cogsExp = totalRev * (cogs / 100);
    const fotCore = coreStaff.reduce((s, st) => s + st.count * st.baseSalary * g.salaryK, 0) * schools;
    const fotAdmin = adminStaff.reduce((s, st) => s + st.count * st.baseSalary * g.salaryK, 0) * schools;
    const fotTotal = fotCore + fotAdmin;
    const fotTax = fotTotal * fotR;
    const rent = g.rent * schools;
    const utilities = g.rent * 0.08 * schools;
    const rawMkt = g.mktMax * MKT_CURVE[i];
    const mktC = Math.max(g.mktMin, Math.min(g.mktMax, rawMkt)) * schools;
    const royalty = Math.max(15000 * schools, totalRev * 0.05);
    const misc = 15000 * schools;
    const rko = 700 * schools;
    const acquiring = totalRev * 0.019;
    const dirCost = rg.hasDir ? (dirSalary || 0) * (1 + fotR) : 0;

    const opEx = cogsExp + fotCore + fotAdmin + fotTax + rent + utilities + mktC + royalty + misc + rko + acquiring + dirCost;

    // Налог
    const taxR = rg.calc({ rev: totalRev, exp: opEx, pat: patentAnnual });
    const tax = taxR.tax || 0;
    const totExp = opEx + tax;

    // Прибыль
    const opProfit = totalRev - opEx;
    const netProfit = totalRev - totExp;
    const margin = totalRev > 0 ? r(netProfit / totalRev * 100) : 0;

    cum += netProfit;
    if (cum >= 0 && payback === null) payback = i + 1;

    months.push({
      m: i + 1,
      label: `${i + 1}`,
      calMonth,
      calMonthName: MONTH_SHORT[calMonth],
      clientsPerDay: r(clientsPerDay),
      clients: r(clientsMonth / schools),
      mainRev: r(mainRev),
      upsell: r(upsell),
      oneTime: r(oneTime),
      tot: r(totalRev),
      cogsExp: r(cogsExp),
      fotCore: r(fotCore),
      fotAdmin: r(fotAdmin),
      fotTax: r(fotTax),
      rent: r(rent),
      utilities: r(utilities),
      mktC: r(mktC),
      royalty: r(royalty),
      misc: r(misc),
      rko: r(rko),
      acquiring: r(acquiring),
      dirCost: r(dirCost),
      tax: r(tax),
      totExp: r(totExp),
      opProfit: r(opProfit),
      net: r(netProfit),
      margin,
      cum: r(cum),
    });
  }

  const y1avg = months.slice(0, 12).reduce((s, m) => s + m.net, 0) / 12;
  const y2avg = months.slice(12, 24).reduce((s, m) => s + m.net, 0) / 12;
  const y2rev = months.slice(12, 24).reduce((s, m) => s + m.tot, 0) / 12;
  const y2margin = y2rev > 0 ? r(y2avg / y2rev * 100) : 0;
  const totalProfit24 = months.reduce((s, m) => s + m.net, 0);
  const roi = inv > 0 ? r(totalProfit24 / inv * 100) : 0;

  return { months, payback, y1avg, y2avg, y2margin, inv, roi };
}
