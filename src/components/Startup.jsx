import { T } from '../theme';
import { fmt, fmtM, r, RUB } from '../helpers';
import { STARTUP_CATEGORIES } from '../data/staff';
import Card from './ui/Card';
import InfoTip from './ui/InfoTip';

export default function Startup({ schools, cityName, g, payback, inv }) {
  const sections = [
    {
      l: "Паушальный взнос", color: T.red,
      items: [["Паушальный взнос франшизы", schools, g.franchise]],
      info: "Единовременный платёж за право работать под брендом. Зависит от группы города.",
    },
    ...STARTUP_CATEGORIES.map(cat => ({
      l: cat.cat, color: cat.color,
      items: cat.items.map(([n, q, p]) => {
        if (n.includes("Аренда")) return [n, schools, r(g.rent * 2)];
        return [n, q * schools, p];
      }),
      info: "В рабочей версии сумма и состав настраиваются под вашу франшизу",
    })),
  ];

  const sectionTotals = sections.map(sec => ({
    label: sec.l, color: sec.color,
    total: sec.items.reduce((a, [, q, p]) => a + q * p, 0),
  }));
  const grandTotal = sectionTotals.reduce((a, s) => a + s.total, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 10, color: T.gray, letterSpacing: 1.5, textTransform: "uppercase" }}>
        Стартовые инвестиции {String.fromCharCode(183)} {schools} точ. {String.fromCharCode(183)} {cityName}
      </div>

      {sections.map((sec, si) => {
        const tot = sec.items.reduce((a, [, q, p]) => a + q * p, 0);
        return (
          <Card key={si}>
            <div style={{
              padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
              borderBottom: `1px solid ${T.border}`, borderLeft: `3px solid ${sec.color}`, borderRadius: "12px 12px 0 0",
            }}>
              <span style={{ fontWeight: 700, color: T.white, fontSize: 12, display: "flex", alignItems: "center" }}>
                {sec.l}<InfoTip text={sec.info} />
              </span>
              <span style={{ fontWeight: 700, color: sec.color, fontSize: 12 }}>{fmt(tot)} {RUB}</span>
            </div>
            {sec.items.map(([name, qty, price], i) => (
              <div key={i} style={{
                padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
                borderBottom: i < sec.items.length - 1 ? `1px solid ${T.border}` : "none",
              }}>
                <div>
                  <div style={{ fontSize: 12, color: T.white }}>{name}</div>
                  <div style={{ fontSize: 9, color: T.gray, marginTop: 1 }}>{qty} x {fmt(price)} {RUB}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 12, color: T.white }}>{fmt(qty * price)} {RUB}</div>
              </div>
            ))}
          </Card>
        );
      })}

      {/* Горизонтальный stacked bar */}
      <Card style={{ padding: 14 }}>
        <div style={{ fontSize: 10, color: T.gray, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Структура инвестиций</div>
        <div style={{ display: "flex", height: 28, borderRadius: 6, overflow: "hidden", marginBottom: 10 }}>
          {sectionTotals.map((s, i) => {
            const pct = grandTotal > 0 ? (s.total / grandTotal * 100) : 0;
            if (pct < 1) return null;
            return (
              <div key={i} style={{
                width: `${pct}%`, background: `${s.color}88`, borderRight: i < sectionTotals.length - 1 ? `1px solid ${T.bg}` : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 8, fontWeight: 700, color: T.white, overflow: "hidden", whiteSpace: "nowrap",
              }}>
                {pct > 8 ? `${r(pct)}%` : ""}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {sectionTotals.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
              <span style={{ fontSize: 9, color: T.gray }}>{s.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{
        borderRadius: 12, padding: "16px 18px", background: `linear-gradient(135deg,${T.surface},${T.card})`,
        border: `1px solid ${T.accent}`, display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 9, color: T.gray, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Итого инвестиций</div>
          <div style={{ color: T.gray, fontSize: 11 }}>
            Окупаемость: <span style={{ color: T.accent, fontWeight: 700 }}>{payback ? `${payback} мес.` : ">24"}</span>
          </div>
        </div>
        <div style={{ color: T.accent, fontWeight: 900, fontSize: 20 }}>{fmtM(inv)}</div>
      </div>
    </div>
  );
}
