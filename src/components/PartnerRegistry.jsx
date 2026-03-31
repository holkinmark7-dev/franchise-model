import { T } from '../theme';
import { RUB } from '../helpers';
import { ALL_CITIES } from '../data/cities';
import { OCCUPIED_CITIES } from '../data/staff';
import Card from './ui/Card';
import AddonBadge from './ui/Badge';
import InfoTip from './ui/InfoTip';

export default function PartnerRegistry({ partnerFilter, setPartnerFilter }) {
  const allCities = ALL_CITIES.filter(c => c[1] > 100000);
  const filtered = partnerFilter === "all" ? allCities
    : partnerFilter === "free" ? allCities.filter(c => !OCCUPIED_CITIES.includes(c[0]))
    : allCities.filter(c => OCCUPIED_CITIES.includes(c[0]));
  const freeCount = allCities.filter(c => !OCCUPIED_CITIES.includes(c[0])).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <AddonBadge price="по запросу" />
      <div style={{ fontSize: 10, color: T.gray, letterSpacing: 1.5, textTransform: "uppercase" }}>
        Реестр партнёров {String.fromCharCode(183)} Открытые города
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <Card style={{ padding: 10, textAlign: "center", borderTop: `2px solid ${T.green}` }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: T.green }}>{freeCount}</div>
          <div style={{ fontSize: 9, color: T.gray, textTransform: "uppercase" }}>Свободно</div>
        </Card>
        <Card style={{ padding: 10, textAlign: "center", borderTop: `2px solid ${T.red}` }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: T.red }}>{OCCUPIED_CITIES.length}</div>
          <div style={{ fontSize: 9, color: T.gray, textTransform: "uppercase" }}>Занято</div>
        </Card>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {[
          { id: "all", l: "Все" },
          { id: "free", l: "Свободные" },
          { id: "occupied", l: "Занятые" },
        ].map(f => (
          <button key={f.id} onClick={() => setPartnerFilter(f.id)}
            style={{
              flex: 1, padding: "8px", border: "none", borderRadius: 8, cursor: "pointer",
              fontWeight: 600, fontSize: 11,
              background: partnerFilter === f.id ? `${T.accent}22` : T.surface,
              color: partnerFilter === f.id ? T.accent : T.gray,
              outline: `1px solid ${partnerFilter === f.id ? T.accent : T.border}`,
            }}>{f.l}</button>
        ))}
      </div>

      <Card style={{ overflow: "hidden" }}>
        {filtered.map((c, i) => {
          const occ = OCCUPIED_CITIES.includes(c[0]);
          return (
            <div key={i} style={{
              padding: "9px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
              borderBottom: `1px solid ${T.border}`, background: occ ? "rgba(229,57,75,.04)" : "transparent",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: occ ? T.red : T.green }} />
                <span style={{ fontSize: 12, color: occ ? T.gray : T.white, fontWeight: occ ? 400 : 600 }}>{c[0]}</span>
              </div>
              <span style={{
                fontSize: 9, padding: "2px 8px", borderRadius: 20,
                background: occ ? `${T.red}15` : `${T.green}15`, color: occ ? T.red : T.green, fontWeight: 600,
              }}>
                {occ ? "Занят" : "Свободен"}
              </span>
            </div>
          );
        })}
      </Card>

      <div style={{ padding: 12, background: `${T.accent}08`, borderRadius: 8, border: `1px solid ${T.accent}22` }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <InfoTip text="Интегрируется с вашей CRM. Обновляется автоматически при продаже франшизы. Партнёр видит актуальную карту территорий." />
          <span style={{ fontSize: 10, color: T.gray }}>Автоматическое обновление при продаже франшизы</span>
        </div>
      </div>
    </div>
  );
}
