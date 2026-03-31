import { useState, useMemo } from 'react';
import { T } from './theme';
import { defaultGroups } from './data/groups';
import { ALL_CITIES } from './data/cities';
import { TAX_REGIMES } from './data/taxRegimes';
import { DEFAULT_SEASONALITY } from './data/seasonality';
import { DEFAULT_STAFF, OCCUPIED_CITIES } from './data/staff';
import { calcModel } from './model/calcModel';

import Dashboard from './components/Dashboard';
import PnL from './components/PnL';
import Startup from './components/Startup';
import DevPanel from './components/DevPanel';
import FranchisePackage from './components/FranchisePackage';
import OrgStructure from './components/OrgStructure';
import GanttChart from './components/GanttChart';
import MarketAI from './components/MarketAI';
import PartnerRegistry from './components/PartnerRegistry';

export default function App() {
  // Состояние
  const [groups, setGroups] = useState(defaultGroups);
  const [cityData, setCityData] = useState(ALL_CITIES.find(c => c[0] === "Краснодар") || ALL_CITIES[0]);
  const [schools, setSch] = useState(1);
  const [baseCheck, setCheck] = useState(800);
  const [baseTraffic, setTraffic] = useState(40);
  const [cogs, setCogs] = useState(30);
  const [upsellPct, setUpsell] = useState(10);
  const [staff, setStaff] = useState(DEFAULT_STAFF);
  const [regime, setRegime] = useState("ip_usn6");
  const [patentAnnual, setPat] = useState(30000);
  const [dirSalary, setDir] = useState(50000);
  const [fotMSP, setMSP] = useState(false);
  const [startMonth, setStartMonth] = useState(9);
  const [seasonality, setSeasonality] = useState(DEFAULT_SEASONALITY);
  const [growthSpeed, setGrowthSpeed] = useState(0.5);
  const [plateauMonth, setPlateauMonth] = useState(12);
  const [taxOpen, setTO] = useState(false);
  const [bizOpen, setBO] = useState(true);
  const [tab, setTab] = useState("overview");
  const [partnerFilter, setPartnerFilter] = useState("all");

  const cityName = cityData[0];
  const groupId = cityData[2];
  const g = useMemo(() => groups.find(x => x.id === groupId) || groups[0], [groups, groupId]);
  const rg = TAX_REGIMES.find(rx => rx.id === regime) || TAX_REGIMES[0];

  const model = useMemo(() => calcModel({
    g, baseCheck, baseTraffic, cogs, upsellPct, staff, schools,
    regime, patentAnnual, dirSalary, fotMSP,
    startMonth, seasonality, growthSpeed, plateauMonth,
  }), [g, baseCheck, baseTraffic, cogs, upsellPct, staff, schools, regime, patentAnnual, dirSalary, fotMSP, startMonth, seasonality, growthSpeed, plateauMonth]);

  const { months, payback, y1avg, y2avg, y2margin, inv, roi } = model;
  const isOccupied = OCCUPIED_CITIES.includes(cityName);

  const TABS = [
    { id: "overview", l: "Обзор", base: true },
    { id: "pnl", l: "P&L", base: true },
    { id: "startup", l: "Инвестиции", base: true },
    { id: "dev", l: "Настройки", base: true },
    { id: "franchise", l: "Пакеты", addon: true },
    { id: "org", l: "Команда", addon: true },
    { id: "gantt", l: "Процесс", addon: true },
    { id: "market", l: "Рынок AI", addon: true },
    { id: "partners", l: "Реестр", addon: true },
  ];

  return (
    <div style={{
      fontFamily: "system-ui, 'Segoe UI', sans-serif", background: T.bg,
      minHeight: "100vh", maxWidth: 540, margin: "0 auto", color: T.white,
    }}>
      {/* Шапка */}
      <div style={{
        background: `linear-gradient(180deg,${T.surface},${T.bg})`, borderBottom: `1px solid ${T.border}`,
        padding: "16px 18px 0", position: "sticky", top: 0, zIndex: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div style={{
            fontSize: 20, fontWeight: 900, color: T.accent, letterSpacing: -0.5,
            fontFamily: "system-ui, sans-serif",
          }}>closr</div>
          <div style={{ width: 1, height: 24, background: T.border }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: T.gray, letterSpacing: 1.5, textTransform: "uppercase" }}>
              Финансовая модель франшизы
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 8, color: T.gray, textTransform: "uppercase", letterSpacing: .5 }}>Окупаемость</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: T.accent, lineHeight: 1.2 }}>{payback ? `${payback}м` : ">24"}</div>
          </div>
        </div>

        {/* Табы */}
        <div style={{
          display: "flex", overflowX: "auto", gap: 0, scrollbarWidth: "none",
          msOverflowStyle: "none", WebkitOverflowScrolling: "touch",
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                flexShrink: 0, padding: "9px 12px", border: "none", background: "none", cursor: "pointer",
                fontWeight: 600, fontSize: 11, letterSpacing: .2, position: "relative",
                color: tab === t.id ? T.white : t.addon ? T.gold : T.gray,
                borderBottom: tab === t.id ? `2px solid ${t.addon ? T.gold : T.accent}` : "2px solid transparent",
                marginBottom: -1, transition: ".15s",
              }}>
              {t.l}
            </button>
          ))}
        </div>
      </div>

      {/* Плашка DEMO */}
      <div style={{
        background: `linear-gradient(90deg,${T.accent}11,${T.gold}11)`,
        padding: "6px 18px", borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 9, color: T.accent, fontWeight: 700, letterSpacing: 1 }}>DEMO</span>
        <span style={{ fontSize: 9, color: T.gray }}>Демо-версия {String.fromCharCode(183)} Данные условные</span>
      </div>

      {/* Контент */}
      <div style={{ padding: "14px 14px 48px" }}>
        {tab === "overview" && (
          <Dashboard
            months={months} payback={payback} y1avg={y1avg} y2avg={y2avg} y2margin={y2margin} inv={inv} roi={roi}
            cityData={cityData} setCityData={setCityData} cityName={cityName} g={g} rg={rg}
            schools={schools} setSch={setSch} startMonth={startMonth} setStartMonth={setStartMonth}
            baseCheck={baseCheck} setCheck={setCheck} baseTraffic={baseTraffic} setTraffic={setTraffic}
            cogs={cogs} setCogs={setCogs} upsellPct={upsellPct} setUpsell={setUpsell}
            staff={staff} setStaff={setStaff}
            regime={regime} setRegime={setRegime} patentAnnual={patentAnnual} setPat={setPat}
            dirSalary={dirSalary} setDir={setDir} fotMSP={fotMSP} setMSP={setMSP}
            bizOpen={bizOpen} setBO={setBO} taxOpen={taxOpen} setTO={setTO}
            isOccupied={isOccupied}
          />
        )}
        {tab === "pnl" && <PnL months={months} rg={rg} cityName={cityName} />}
        {tab === "startup" && <Startup schools={schools} cityName={cityName} g={g} payback={payback} inv={inv} />}
        {tab === "dev" && (
          <DevPanel
            groups={groups} setGroups={setGroups}
            seasonality={seasonality} setSeasonality={setSeasonality}
            growthSpeed={growthSpeed} setGrowthSpeed={setGrowthSpeed}
            plateauMonth={plateauMonth} setPlateauMonth={setPlateauMonth}
          />
        )}
        {tab === "franchise" && <FranchisePackage />}
        {tab === "org" && <OrgStructure />}
        {tab === "gantt" && <GanttChart />}
        {tab === "market" && <MarketAI cityName={cityName} />}
        {tab === "partners" && <PartnerRegistry partnerFilter={partnerFilter} setPartnerFilter={setPartnerFilter} />}
      </div>
    </div>
  );
}
