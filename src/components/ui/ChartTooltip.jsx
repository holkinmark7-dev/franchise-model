import { T } from '../../theme';
import { fmt, RUB } from '../../helpers';

export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8,
      padding: "10px 13px", boxShadow: "0 8px 32px rgba(0,0,0,.6)" }}>
      <div style={{ fontSize: 9, color: T.gray, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>
        Месяц {label}
      </div>
      {payload.map(p => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: 14, marginBottom: 2 }}>
          <span style={{ fontSize: 10, color: T.gray }}>{p.name}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: p.color }}>{fmt(p.value)} {RUB}</span>
        </div>
      ))}
    </div>
  );
}
