import { useState } from 'react';
import { T } from '../theme';
import { fmt, RUB } from '../helpers';
import Card from './ui/Card';
import AddonBadge from './ui/Badge';
import InfoTip from './ui/InfoTip';

export default function MarketAI({ cityName }) {
  const [state, setState] = useState("idle");
  const [data, setData] = useState(null);

  const search = async () => {
    setState("loading");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 2000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{
            role: "user",
            content: `Найди основных конкурентов бизнеса (любые франшизы и локальные бизнесы) в городе ${cityName}, Россия. Оцени рыночную ситуацию. Верни ТОЛЬКО JSON:
{"competitors":[{"name":"","type":"франшиза/локальный/сеть","info":""}],"summary":"","saturation":"низкая/средняя/высокая","avgCheck":"","opportunities":""}`
          }],
        }),
      });
      const json = await res.json();
      const text = (json.content || []).filter(b => b.type === "text").map(b => b.text).join("");
      const m = text.match(/\{[\s\S]*\}/);
      if (m) { setData(JSON.parse(m[0])); setState("done"); }
      else setState("error");
    } catch { setState("error"); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <AddonBadge price={`от 29 000 ${RUB}`} />
      <div style={{ fontSize: 10, color: T.gray, letterSpacing: 1.5, textTransform: "uppercase" }}>
        AI-анализ рынка {String.fromCharCode(183)} Конкуренты {String.fromCharCode(183)} {cityName}
      </div>

      {state === "idle" && (
        <Card style={{ padding: "28px 20px", textAlign: "center" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 8px" }}>
            <circle cx="11" cy="11" r="7" stroke={T.accent} strokeWidth="2" />
            <path d="M16 16L20 20" stroke={T.accent} strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div style={{ color: T.white, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>AI-анализ рынка: {cityName}</div>
          <div style={{ color: T.gray, fontSize: 11, marginBottom: 16, lineHeight: 1.6 }}>
            Поиск конкурентов, оценка насыщенности, возможности для входа
          </div>
          <button onClick={search} style={{
            padding: "12px 24px",
            background: `linear-gradient(135deg,${T.accent},${T.accentD})`,
            border: "none", borderRadius: 8, color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}>
            Запустить анализ
          </button>
        </Card>
      )}
      {state === "loading" && (
        <Card style={{ padding: "36px 20px", textAlign: "center" }}>
          <div style={{ color: T.accent, fontSize: 13 }}>Анализируем рынок {cityName}...</div>
          <div style={{ color: T.gray, fontSize: 11, marginTop: 4 }}>Поиск в интернете, 2GIS, соцсети</div>
        </Card>
      )}
      {state === "error" && (
        <Card style={{ padding: 16, borderColor: T.red }}>
          <div style={{ color: T.red, fontWeight: 700, marginBottom: 8 }}>Ошибка</div>
          <button onClick={() => setState("idle")} style={{
            padding: "8px 16px", background: T.surface,
            border: `1px solid ${T.border}`, borderRadius: 6, color: T.white, fontSize: 12, cursor: "pointer",
          }}>Назад</button>
        </Card>
      )}
      {state === "done" && data && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <Card style={{ padding: 12, borderTop: `2px solid ${T.blue}` }}>
              <div style={{ fontSize: 9, color: T.gray, textTransform: "uppercase", marginBottom: 4 }}>Конкурентов</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: T.blue }}>{data.competitors?.length || 0}</div>
            </Card>
            <Card style={{ padding: 12, borderTop: `2px solid ${data.saturation === "высокая" ? T.red : data.saturation === "средняя" ? T.gold : T.green}` }}>
              <div style={{ fontSize: 9, color: T.gray, textTransform: "uppercase", marginBottom: 4 }}>Насыщенность</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: data.saturation === "высокая" ? T.red : data.saturation === "средняя" ? T.gold : T.green }}>
                {data.saturation || "-"}
              </div>
            </Card>
            {data.avgCheck && (
              <Card style={{ padding: 12, borderTop: `2px solid ${T.accent}` }}>
                <div style={{ fontSize: 9, color: T.gray, textTransform: "uppercase", marginBottom: 4 }}>Средний чек</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.accent }}>{data.avgCheck}</div>
              </Card>
            )}
          </div>
          {data.summary && (
            <Card style={{ padding: 12, borderLeft: `3px solid ${T.accent}` }}>
              <div style={{ fontSize: 9, color: T.accent, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Анализ рынка</div>
              <div style={{ fontSize: 12, color: T.white, lineHeight: 1.7 }}>{data.summary}</div>
            </Card>
          )}
          {data.opportunities && (
            <Card style={{ padding: 12, borderLeft: `3px solid ${T.green}` }}>
              <div style={{ fontSize: 9, color: T.green, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Возможности</div>
              <div style={{ fontSize: 12, color: T.white, lineHeight: 1.7 }}>{data.opportunities}</div>
            </Card>
          )}
          {data.competitors?.map((c, i) => (
            <Card key={i} style={{ padding: "10px 14px" }}>
              <div style={{ fontWeight: 700, color: T.white, fontSize: 13 }}>{c.name}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                <span style={{
                  fontSize: 9, padding: "2px 8px", borderRadius: 20,
                  background: c.type === "франшиза" ? `${T.gold}22` : c.type === "сеть" ? `${T.blue}22` : `${T.green}22`,
                  color: c.type === "франшиза" ? T.gold : c.type === "сеть" ? T.blue : T.green, fontWeight: 600,
                }}>{c.type}</span>
              </div>
              {c.info && <div style={{ fontSize: 11, color: T.gray, marginTop: 4, lineHeight: 1.5 }}>{c.info}</div>}
            </Card>
          ))}
          <button onClick={() => { setState("idle"); setData(null); }}
            style={{
              padding: "10px", background: "none", border: `1px solid ${T.border}`,
              borderRadius: 8, color: T.gray, fontSize: 11, cursor: "pointer",
            }}>Обновить</button>
        </div>
      )}

      <div style={{ padding: 12, background: `${T.accent}08`, borderRadius: 8, border: `1px solid ${T.accent}22` }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <InfoTip text="В рабочей версии AI анализирует 50+ источников: 2GIS, Яндекс.Карты, соцсети, сайты конкурентов, отзывы. Отчёт формируется за 2-3 минуты." />
          <span style={{ fontSize: 10, color: T.gray }}>В рабочей версии - расширенный анализ 50+ источников</span>
        </div>
      </div>
    </div>
  );
}
