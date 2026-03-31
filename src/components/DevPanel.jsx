import { useState } from 'react';
import { T } from '../theme';
import { RUB } from '../helpers';
import { defaultGroups } from '../data/groups';
import { SEASON_PRESETS, MONTH_SHORT } from '../data/seasonality';
import Card from './ui/Card';
import Slider from './ui/Slider';
import InfoTip from './ui/InfoTip';

export default function DevPanel({
  groups, setGroups,
  seasonality, setSeasonality,
  growthSpeed, setGrowthSpeed,
  plateauMonth, setPlateauMonth,
}) {
  const [sel, setSel] = useState(groups[0].id);
  const [devSection, setDevSection] = useState("groups");
  const gg = groups.find(x => x.id === sel) || groups[0];
  const upd = (k, v) => setGroups(prev => prev.map(x => x.id === sel ? { ...x, [k]: v } : x));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: `${T.accent}11`, borderRadius: 8, padding: "9px 14px", border: `1px solid ${T.accent}33`, fontSize: 11, color: T.accent, display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke={T.accent} strokeWidth="2" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={T.accent} strokeWidth="2" />
        </svg>
        DEV-панель {String.fromCharCode(183)} Настройка параметров модели
        <InfoTip text="DEV-панель доступна владельцу модели. Позволяет настроить все параметры под экономику вашей франшизы без участия разработчика." />
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {[
          { id: "groups", l: "Группы городов" },
          { id: "seasonality", l: "Сезонность" },
          { id: "growth", l: "Рост" },
        ].map(s => (
          <button key={s.id} onClick={() => setDevSection(s.id)}
            style={{
              flex: 1, padding: "9px 6px", border: "none", borderRadius: 8, cursor: "pointer",
              fontWeight: 600, fontSize: 11,
              background: devSection === s.id ? `${T.accent}22` : T.surface,
              color: devSection === s.id ? T.accent : T.gray,
              outline: `1px solid ${devSection === s.id ? T.accent : T.border}`,
            }}>{s.l}</button>
        ))}
      </div>

      {devSection === "groups" && (
        <>
          <Card style={{ padding: 14 }}>
            <div style={{ fontSize: 10, color: T.gray, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Группа</div>
            {groups.map(gr => (
              <button key={gr.id} onClick={() => setSel(gr.id)}
                style={{
                  display: "block", width: "100%", padding: "9px 12px", marginBottom: 4,
                  background: sel === gr.id ? `${T.accent}15` : T.surface,
                  border: `1px solid ${sel === gr.id ? T.accent : T.border}`, borderRadius: 8, cursor: "pointer", textAlign: "left",
                }}>
                <span style={{ fontWeight: sel === gr.id ? 700 : 400, color: sel === gr.id ? T.white : T.gray, fontSize: 12 }}>{gr.label}</span>
              </button>
            ))}
          </Card>
          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.white, marginBottom: 14 }}>{gg.label}</div>
            <Slider label={`Аренда ${RUB}/мес`} value={gg.rent} set={v => upd("rent", v)} min={5000} max={500000} step={5000} />
            <Slider label="Коэфф. зарплат" value={gg.salaryK * 100} set={v => upd("salaryK", v / 100)} min={20} max={150} step={5} unit="%" />
            <Slider label="Коэфф. трафика" value={gg.trafficK * 100} set={v => upd("trafficK", v / 100)} min={10} max={150} step={5} unit="%" />
            <Slider label="Коэфф. чека" value={gg.checkK * 100} set={v => upd("checkK", v / 100)} min={30} max={150} step={5} unit="%" />
            <Slider label="Маркетинг MAX" value={gg.mktMax} set={v => upd("mktMax", v)} min={0} max={200000} step={5000} color={T.gold} />
            <Slider label="Маркетинг MIN" value={gg.mktMin} set={v => upd("mktMin", v)} min={0} max={100000} step={1000} color={T.gold} />
            <Slider label="Паушальный взнос" value={gg.franchise} set={v => upd("franchise", v)} min={50000} max={3000000} step={10000} color={T.red} />
            <button onClick={() => setGroups(defaultGroups)}
              style={{
                width: "100%", marginTop: 8, padding: "9px", background: T.surface, border: `1px solid ${T.red}`,
                borderRadius: 8, color: T.red, fontSize: 11, cursor: "pointer", fontWeight: 600,
              }}>Сбросить к значениям по умолчанию</button>
          </Card>
        </>
      )}

      {devSection === "seasonality" && (
        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.white, marginBottom: 6 }}>Коэффициенты сезонности</div>
          <div style={{ fontSize: 10, color: T.gray, marginBottom: 14 }}>Множитель базового трафика клиентов по месяцам</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {Object.entries(SEASON_PRESETS).map(([key, preset]) => (
              <button key={key} onClick={() => setSeasonality([...preset.values])}
                style={{
                  flex: 1, padding: "8px 4px", border: `1px solid ${T.border}`, borderRadius: 6,
                  background: T.surface, color: T.gray, fontSize: 10, cursor: "pointer", fontWeight: 600,
                }}>{preset.label}</button>
            ))}
          </div>
          {MONTH_SHORT.map((name, i) => (
            <Slider key={i} label={name} value={seasonality[i]} set={v => {
              const next = [...seasonality];
              next[i] = v;
              setSeasonality(next);
            }} min={0.5} max={1.3} step={0.05} color={seasonality[i] >= 1 ? T.green : T.gold} />
          ))}
        </Card>
      )}

      {devSection === "growth" && (
        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.white, marginBottom: 6 }}>Параметры S-curve роста</div>
          <div style={{ fontSize: 10, color: T.gray, marginBottom: 14 }}>Логистическая кривая набора клиентской базы</div>
          <Slider label="Месяц выхода на плато" value={plateauMonth} set={setPlateauMonth} min={6} max={18} step={1} color={T.blue} />
          <Slider label="Скорость набора" value={growthSpeed * 100} set={v => setGrowthSpeed(v / 100)} min={20} max={100} step={5} unit="%" color={T.accent} />
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {[
              { l: "Консервативный", v: 0.3, pm: 14 },
              { l: "Умеренный", v: 0.5, pm: 12 },
              { l: "Агрессивный", v: 0.8, pm: 8 },
            ].map(preset => (
              <button key={preset.l} onClick={() => { setGrowthSpeed(preset.v); setPlateauMonth(preset.pm); }}
                style={{
                  flex: 1, padding: "10px 4px", border: `1px solid ${growthSpeed === preset.v ? T.accent : T.border}`,
                  borderRadius: 8, background: growthSpeed === preset.v ? `${T.accent}15` : T.surface,
                  color: growthSpeed === preset.v ? T.accent : T.gray, fontSize: 10, cursor: "pointer", fontWeight: 600,
                }}>{preset.l}</button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
