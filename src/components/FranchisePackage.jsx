import { T } from '../theme';
import { RUB } from '../helpers';
import AddonBadge from './ui/Badge';
import InfoTip from './ui/InfoTip';

export default function FranchisePackage() {
  const packages = [
    { name: "Лайт", price: "300 000", c: T.blue },
    { name: "Стандарт", price: "600 000", c: T.accent, hot: true },
    { name: "Премиум", price: "1 200 000", c: T.gold },
  ];
  const features = [
    { l: "Паушальный взнос", values: ["300 000 " + RUB, "600 000 " + RUB, "1 200 000 " + RUB] },
    { l: "Обучение", values: ["3 дня", "10 дней", "21 день + стажировка"] },
    { l: "Бренд-бук и фирменный стиль", values: ["Базовый", "Полный", "Полный + адаптация"] },
    { l: "Маркетинговый пакет", values: [false, true, "Да + запуск под ключ"] },
    { l: "CRM-система", values: [false, "Настройка", "Настройка + интеграции"] },
    { l: "Поддержка", values: ["3 мес.", "12 мес.", "24 мес. + куратор"] },
    { l: "Эксклюзивная территория", values: [false, "Город", "Город + область"] },
    { l: "Гарантия окупаемости", values: [false, false, "Да (с условиями)"] },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <AddonBadge price={`от 10 000 ${RUB}`} />
      <div style={{ fontSize: 10, color: T.gray, letterSpacing: 1.5, textTransform: "uppercase" }}>
        Франшизный пакет {String.fromCharCode(183)} Сравнение
      </div>

      <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${T.border}` }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 400 }}>
          <thead>
            <tr>
              <th style={{ padding: "12px 10px", textAlign: "left", background: T.surface, borderBottom: `1px solid ${T.border}`, fontSize: 10, color: T.gray, minWidth: 120 }}></th>
              {packages.map((p, i) => (
                <th key={i} style={{
                  padding: "12px 10px", textAlign: "center", background: p.hot ? `${p.c}11` : T.surface,
                  borderBottom: `1px solid ${T.border}`, borderTop: p.hot ? `2px solid ${p.c}` : "none",
                }}>
                  {p.hot && (
                    <div style={{ fontSize: 8, fontWeight: 700, color: p.c, letterSpacing: 1, marginBottom: 2, textTransform: "uppercase" }}>
                      Рекомендуем
                    </div>
                  )}
                  <div style={{ fontSize: 14, fontWeight: 800, color: p.c }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: T.gray, marginTop: 2 }}>{p.price} {RUB}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((f, fi) => (
              <tr key={fi} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "10px 10px", fontSize: 11, color: T.white, fontWeight: 500 }}>{f.l}</td>
                {f.values.map((v, vi) => (
                  <td key={vi} style={{
                    padding: "10px 10px", textAlign: "center", fontSize: 11,
                    background: packages[vi].hot ? `${packages[vi].c}06` : "transparent",
                    color: v === false ? T.gray : v === true ? T.green : T.white,
                    fontWeight: v === true || (typeof v === "string" && v.includes("Да")) ? 600 : 400,
                  }}>
                    {v === false ? String.fromCharCode(8212) : v === true ? String.fromCharCode(10003) : v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: 12, background: `${T.accent}08`, borderRadius: 8, border: `1px solid ${T.accent}22` }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <InfoTip text="Количество пакетов, состав и цены полностью настраиваются под вашу франшизу" />
          <span style={{ fontSize: 10, color: T.gray }}>Пакеты и цены настраиваются под вашу франшизу</span>
        </div>
      </div>
    </div>
  );
}
