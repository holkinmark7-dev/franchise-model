import { T } from '../theme';
import { fmt, r, RUB } from '../helpers';
import InfoTip from './ui/InfoTip';

export default function PnL({ months, rg, cityName }) {
  const rows = [
    { l: "ИТОГО ВЫРУЧКА", k: "tot", bold: true, top: true, c: T.blue, summary: true, info: "Суммарная выручка: основная + допродажи + разовые услуги" },
    { l: "Основная выручка", k: "mainRev", ind: true },
    { l: "Допродажи / факультативы", k: "upsell", ind: true },
    { l: "Разовые услуги", k: "oneTime", ind: true },
    { l: "ИТОГО РАСХОДЫ", k: "totExp", bold: true, top: true, c: T.red, summary: true, info: "Все операционные расходы включая налоги" },
    { l: "Себестоимость / материалы", k: "cogsExp", ind: true },
    { l: "ФОТ основной персонал", k: "fotCore", ind: true },
    { l: "ФОТ администрация", k: "fotAdmin", ind: true },
    { l: "Налоги на ФОТ (ЕСН)", k: "fotTax", ind: true },
    { l: "Аренда помещения", k: "rent", ind: true },
    { l: "Коммунальные платежи", k: "utilities", ind: true },
    { l: "Маркетинг и реклама", k: "mktC", ind: true },
    { l: "Роялти", k: "royalty", ind: true },
    { l: "Прочие расходы", k: "misc", ind: true },
    { l: "Банковское обслуживание (РКО)", k: "rko", ind: true },
    { l: "Эквайринг", k: "acquiring", ind: true },
    ...(rg.hasDir ? [{ l: "Директор ООО", k: "dirCost", ind: true }] : []),
    { l: `Налог (${rg.label})`, k: "tax", ind: true, c: T.purple },
    { l: "ОПЕРАЦИОННАЯ ПРИБЫЛЬ", k: "opProfit", bold: true, top: true },
    { l: "ЧИСТАЯ ПРИБЫЛЬ", k: "net", bold: true, isNet: true, summary: true, info: "Выручка минус все расходы и налоги" },
    { l: "Рентабельность %", k: "margin", suf: "%", c: T.gray },
    { l: "Накопленный CF", k: "cum", isCum: true, summary: true, info: "Накопленный денежный поток с учётом стартовых инвестиций" },
  ];

  const visibleRows = rows.filter(row => {
    if (row.summary || row.bold) return true;
    const allZero = months.every(m => (m[row.k] || 0) === 0);
    return !allZero;
  });

  const avg = k => months.reduce((s, m) => s + (m[k] || 0), 0) / months.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 10, color: T.gray, letterSpacing: 1.5, textTransform: "uppercase" }}>
        P&L {String.fromCharCode(183)} 24 месяца {String.fromCharCode(183)} {cityName}
      </div>
      <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${T.border}` }}>
        <table style={{ borderCollapse: "collapse", fontSize: 10, minWidth: 800, width: "100%" }}>
          <thead>
            <tr style={{ background: T.surface }}>
              <th style={{
                padding: "9px 10px", textAlign: "left", color: T.gray, fontWeight: 600, fontSize: 8, letterSpacing: .8, textTransform: "uppercase",
                minWidth: 160, position: "sticky", left: 0, background: T.surface, borderBottom: `1px solid ${T.border}`, zIndex: 2,
              }}>Показатель</th>
              {months.map(m => (
                <th key={m.m} style={{
                  padding: "7px 5px", color: m.m === 13 ? T.gold : T.gray, textAlign: "right", minWidth: 54, fontWeight: 600, fontSize: 8,
                  borderBottom: `1px solid ${T.border}`, borderLeft: m.m === 13 ? `2px solid ${T.gold}` : undefined,
                }}>M{m.m}</th>
              ))}
              <th style={{
                padding: "7px 7px", color: T.accent, textAlign: "right", minWidth: 60, fontWeight: 700, fontSize: 8,
                borderBottom: `1px solid ${T.border}`, borderLeft: `1px solid ${T.border}`, background: T.surface,
              }}>Сред.</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, ri) => {
              const av = avg(row.k);
              return (
                <tr key={ri} style={{
                  borderTop: row.top ? `1px solid ${T.border}` : "none",
                  background: row.bold ? "rgba(255,255,255,.02)" : "transparent",
                }}>
                  <td style={{
                    padding: "5px 10px", fontWeight: row.bold ? 700 : 400, color: row.c || T.white, fontSize: row.bold ? 10 : 9,
                    paddingLeft: row.ind ? 22 : 10, position: "sticky", left: 0,
                    background: row.bold ? "rgba(15,26,44,.98)" : T.card, borderRight: `1px solid ${T.border}`,
                    whiteSpace: "nowrap", zIndex: 1, display: "flex", alignItems: "center", gap: 2,
                  }}>
                    {row.l}
                    {row.info && <InfoTip text={row.info} />}
                  </td>
                  {months.map(m => {
                    const v = m[row.k] || 0;
                    return (
                      <td key={m.m} style={{
                        padding: "5px 5px", textAlign: "right", fontWeight: row.bold ? 700 : 400, fontSize: 9,
                        color: row.isNet ? (v >= 0 ? T.greenL : T.red) : row.isCum ? (v >= 0 ? T.greenL : T.gray) : (row.c || T.white),
                        borderLeft: m.m === 13 ? `2px solid ${T.gold}` : undefined,
                      }}>
                        {row.suf ? `${v}${row.suf}` : fmt(v)}
                      </td>
                    );
                  })}
                  <td style={{
                    padding: "5px 7px", textAlign: "right", fontWeight: 700, fontSize: 9,
                    borderLeft: `1px solid ${T.border}`, color: row.isNet ? (av >= 0 ? T.greenL : T.red) : (row.c || T.accent),
                  }}>
                    {row.suf ? `${r(av)}${row.suf}` : fmt(av)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 9, color: T.gray, textAlign: "center", padding: 4 }}>
        Золотая линия {String.fromCharCode(8212)} начало второго года {String.fromCharCode(183)} Нулевые строки скрыты
      </div>
    </div>
  );
}
