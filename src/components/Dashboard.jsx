import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import { T } from '../theme';
import { fmt, fmtM, fK, RUB } from '../helpers';
import { MONTH_NAMES } from '../data/seasonality';
import { TAX_REGIMES } from '../data/taxRegimes';
import Card from './ui/Card';
import InfoTip from './ui/InfoTip';
import Slider from './ui/Slider';
import CitySelect from './ui/CitySelect';
import Accordion from './ui/Accordion';
import ChartTooltip from './ui/ChartTooltip';

export default function Dashboard({
  months, payback, y1avg, y2avg, y2margin, inv, roi,
  cityData, setCityData, cityName, g, rg, schools, setSch,
  startMonth, setStartMonth,
  baseCheck, setCheck, baseTraffic, setTraffic, cogs, setCogs,
  upsellPct, setUpsell, staff, setStaff,
  regime, setRegime, patentAnnual, setPat, dirSalary, setDir, fotMSP, setMSP,
  bizOpen, setBO, taxOpen, setTO, isOccupied,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Выбор города и параметры */}
      <Card style={{ padding: 16 }}>
        <div style={{ fontSize: 10, color: T.gray, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Город</div>
        <CitySelect value={cityName} onChange={c => setCityData(c)} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, padding: "7px 12px",
          background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.accent }} />
          <span style={{ fontSize: 11, color: T.gray }}>Группа:</span>
          <span style={{ fontSize: 11, color: T.white, fontWeight: 600 }}>{g.label}</span>
          <span style={{ fontSize: 10, color: T.gray, marginLeft: "auto" }}>{fmt(cityData[1])} чел.</span>
        </div>

        {isOccupied && (
          <div style={{ marginTop: 8, padding: "8px 12px", background: `${T.red}11`, borderRadius: 8, border: `1px solid ${T.red}33`,
            fontSize: 11, color: T.red, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 700 }}>!</span> Город занят партнёром
          </div>
        )}

        <div style={{ fontSize: 10, color: T.gray, marginTop: 14, marginBottom: 8, letterSpacing: .3 }}>КОЛИЧЕСТВО ТОЧЕК</div>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setSch(n)}
              style={{
                flex: 1, padding: "12px 0", border: "none", borderRadius: 8, cursor: "pointer",
                fontWeight: 800, fontSize: 16, transition: ".15s",
                background: schools === n ? `linear-gradient(135deg,${T.accent},${T.accentD})` : T.surface,
                color: schools === n ? "#fff" : T.gray,
                outline: `1px solid ${schools === n ? T.accent : T.border}`,
                boxShadow: schools === n ? `0 4px 16px ${T.accent}44` : "none",
              }}>
              {n}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 10, color: T.gray, marginTop: 14, marginBottom: 8, letterSpacing: .3 }}>МЕСЯЦ ОТКРЫТИЯ</div>
        <select value={startMonth} onChange={e => setStartMonth(+e.target.value)}
          style={{
            width: "100%", padding: "10px 14px", background: T.surface,
            border: `1px solid ${T.border}`, borderRadius: 8, color: T.white,
            fontSize: 13, fontFamily: "inherit", outline: "none", appearance: "none",
            cursor: "pointer",
          }}>
          {MONTH_NAMES.map((name, i) => (
            <option key={i} value={i + 1} style={{ background: T.card }}>{name}</option>
          ))}
        </select>
      </Card>

      {/* KPI-карточки */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { l: "Срок окупаемости", v: payback ? `${payback} мес.` : ">24 мес.", s: "с момента запуска", c: T.accent,
            info: "Месяц, в котором накопленный денежный поток становится положительным. В рабочей версии учитывает стоимость денег во времени (NPV)." },
          { l: "Инвестиции", v: fmtM(inv), s: "единовременно", c: T.gold,
            info: "Сумма стартовых вложений включая паушальный взнос, аренду, оборудование и запуск. В рабочей версии каждая статья настраивается." },
          { l: "Чистая прибыль Год 1", v: `${fmt(y1avg)} ${RUB}/мес`, s: "среднее за 12 мес.", c: T.blueL,
            info: "Средняя чистая прибыль за первые 12 месяцев работы. Учитывает сезонность и постепенный набор клиентской базы." },
          { l: "Чистая прибыль Год 2", v: `${fmt(y2avg)} ${RUB}/мес`, s: `маржа ${y2margin}%`, c: T.greenL,
            info: "Средняя чистая прибыль за 13-24 месяцы. К этому времени бизнес выходит на стабильный уровень." },
          { l: "Рентабельность", v: `${y2margin}%`, s: "средняя за Год 2", c: T.purpleL,
            info: "Отношение чистой прибыли к выручке. Средняя за второй год работы. В рабочей версии можно моделировать сценарии." },
          { l: "ROI", v: `${roi}%`, s: "за 24 месяца", c: T.orange,
            info: "Возврат на инвестиции за 24 месяца. (Суммарная прибыль за 24 мес. / Инвестиции) x 100%. Не учитывает стоимость денег во времени." },
        ].map(k => (
          <div key={k.l} style={{
            background: T.card, borderRadius: 12, padding: 13,
            border: `1px solid ${T.border}`, borderTop: `2px solid ${k.c}`,
          }}>
            <div style={{ fontSize: 9, color: T.gray, letterSpacing: .4, textTransform: "uppercase", marginBottom: 6, lineHeight: 1.4, display: "flex", alignItems: "center" }}>
              {k.l}<InfoTip text={k.info} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.white, marginBottom: 2 }}>{k.v}</div>
            <div style={{ fontSize: 10, color: k.c, fontWeight: 600 }}>{k.s}</div>
          </div>
        ))}
      </div>

      {/* Параметры бизнеса */}
      <Accordion title="Параметры бизнеса" open={bizOpen} onToggle={() => setBO(!bizOpen)}>
        <Slider label="Средний чек" value={baseCheck} set={setCheck} min={200} max={5000} step={50} unit={` ${RUB}`} color={T.accent} />
        <Slider label="Клиентов / день (на зрелости)" value={baseTraffic} set={setTraffic} min={5} max={200} step={1} color={T.accent} />
        <Slider label="Себестоимость % от выручки" value={cogs} set={setCogs} min={0} max={70} step={1} unit="%" color={T.gold} />
        <Slider label="Допродажи % от выручки" value={upsellPct} set={setUpsell} min={0} max={30} step={1} unit="%" color={T.green} />
        <div style={{ fontSize: 10, color: T.gray, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, marginTop: 4 }}>Персонал</div>
        {staff.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: T.white, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.role}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: T.surface, borderRadius: 6, padding: "4px 8px", border: `1px solid ${T.border}` }}>
              <button onClick={() => setStaff(p => p.map((x, j) => j === i ? { ...x, count: Math.max(0, x.count - 1) } : x))}
                style={{ background: "none", border: "none", color: T.gray, cursor: "pointer", fontSize: 14, padding: "0 4px" }}>-</button>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.accent, minWidth: 16, textAlign: "center" }}>{s.count}</span>
              <button onClick={() => setStaff(p => p.map((x, j) => j === i ? { ...x, count: x.count + 1 } : x))}
                style={{ background: "none", border: "none", color: T.gray, cursor: "pointer", fontSize: 14, padding: "0 4px" }}>+</button>
            </div>
            <span style={{ fontSize: 10, color: T.gray, whiteSpace: "nowrap" }}>{fmt(s.baseSalary * g.salaryK)} {RUB}</span>
          </div>
        ))}
      </Accordion>

      {/* Налоги */}
      <Accordion title="Налоги" open={taxOpen} onToggle={() => setTO(!taxOpen)} color={T.purple}
        badge={<span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: `${T.purple}22`, color: T.purpleL }}>{rg.org} {String.fromCharCode(183)} {rg.label}</span>}>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {["ИП", "ООО"].map(o => (
            <button key={o} onClick={() => { const f = TAX_REGIMES.find(rx => rx.org === o); if (f) setRegime(f.id); }}
              style={{
                flex: 1, padding: "9px", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13,
                background: rg.org === o ? `linear-gradient(135deg,${T.purple},${T.blue})` : T.surface,
                color: rg.org === o ? T.white : T.gray, outline: `1px solid ${rg.org === o ? T.purple : T.border}`,
              }}>{o}</button>
          ))}
        </div>
        {TAX_REGIMES.filter(rx => rx.org === rg.org).map(rx => (
          <button key={rx.id} onClick={() => setRegime(rx.id)}
            style={{
              display: "block", width: "100%", padding: "10px 12px", marginBottom: 6,
              background: regime === rx.id ? `${T.purple}15` : T.surface,
              border: `1px solid ${regime === rx.id ? T.purple : T.border}`,
              borderRadius: 8, cursor: "pointer", textAlign: "left",
            }}>
            <div style={{ fontWeight: 700, color: regime === rx.id ? T.white : T.gray, fontSize: 12 }}>{rx.label}</div>
            <div style={{ fontSize: 10, color: T.gray, marginTop: 2 }}>{rx.desc}</div>
          </button>
        ))}
        {rg.hasPatent && <Slider label={`Патент ${RUB}/год`} value={patentAnnual} set={setPat} min={6000} max={300000} step={1000} color={T.purple} />}
        {rg.hasDir && <Slider label={`Зарплата директора ${RUB}/мес`} value={dirSalary} set={setDir} min={20000} max={200000} step={5000} color={T.purple} />}
        <div onClick={() => setMSP(!fotMSP)} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 12px", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, cursor: "pointer", marginTop: 4,
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.white }}>Льгота МСП</div>
            <div style={{ fontSize: 10, color: T.gray }}>15% вместо 30% сверх МРОТ</div>
          </div>
          <div style={{ width: 40, height: 22, borderRadius: 11, background: fotMSP ? T.green : T.border, position: "relative", transition: ".2s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 2, left: fotMSP ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: ".2s" }} />
          </div>
        </div>
      </Accordion>

      {/* Графики */}
      {[
        { title: "Выручка и расходы", h: 170, chart: (
          <BarChart data={months} barSize={9} barGap={2} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="1 6" stroke={T.border} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 8, fill: T.gray }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `${fK(v)}`} tick={{ fontSize: 8, fill: T.gray }} axisLine={false} tickLine={false} width={26} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="tot" name="Выручка" fill={T.blue} radius={[2, 2, 0, 0]} />
            <Bar dataKey="totExp" name="Расходы" fill={T.red} radius={[2, 2, 0, 0]} opacity={.8} />
          </BarChart>
        )},
        { title: "Чистая прибыль", h: 160, chart: (
          <BarChart data={months} barSize={12} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="1 6" stroke={T.border} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 8, fill: T.gray }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `${fK(v)}`} tick={{ fontSize: 8, fill: T.gray }} axisLine={false} tickLine={false} width={26} />
            <Tooltip content={<ChartTooltip />} />
            <ReferenceLine y={0} stroke={T.border} />
            <Bar dataKey="net" name="Прибыль" fill={T.green} radius={[2, 2, 0, 0]} />
          </BarChart>
        )},
        { title: `Накопленный CF ${payback ? `(окупаемость: мес. ${payback})` : ""}`, h: 150, chart: (
          <AreaChart data={months} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.accent} stopOpacity={.3} />
                <stop offset="95%" stopColor={T.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="1 6" stroke={T.border} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 8, fill: T.gray }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `${fK(v)}`} tick={{ fontSize: 8, fill: T.gray }} axisLine={false} tickLine={false} width={30} />
            <Tooltip content={<ChartTooltip />} />
            <ReferenceLine y={0} stroke={T.red} strokeWidth={1.5} strokeDasharray="4 3" />
            {payback && <ReferenceLine x={String(payback)} stroke={T.accent} strokeWidth={1} strokeDasharray="4 3" label={{ value: `${payback} мес.`, position: "top", fontSize: 9, fill: T.accent }} />}
            <Area type="monotone" dataKey="cum" name="CF" stroke={T.accent} strokeWidth={2} fill="url(#cg)" dot={false} />
          </AreaChart>
        )},
        { title: "Динамика клиентов (в день)", h: 140, chart: (
          <AreaChart data={months} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="clg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.blue} stopOpacity={.3} />
                <stop offset="95%" stopColor={T.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="1 6" stroke={T.border} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 8, fill: T.gray }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 8, fill: T.gray }} axisLine={false} tickLine={false} width={26} />
            <Tooltip content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 13px", boxShadow: "0 8px 32px rgba(0,0,0,.6)" }}>
                  <div style={{ fontSize: 9, color: T.gray, letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>Месяц {label}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.blue }}>{payload[0].value} клиентов/день</div>
                </div>
              );
            }} />
            <Area type="monotone" dataKey="clientsPerDay" name="Клиентов" stroke={T.blue} strokeWidth={2} fill="url(#clg)" dot={false} />
          </AreaChart>
        )},
      ].map(({ title, h, chart }, i) => (
        <Card key={i} style={{ padding: 16 }}>
          <div style={{ fontSize: 10, color: T.gray, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>{title}</div>
          <ResponsiveContainer width="100%" height={h}>{chart}</ResponsiveContainer>
        </Card>
      ))}
    </div>
  );
}
