import { T } from '../../theme';
import { fmt } from '../../helpers';
import InfoTip from './InfoTip';

export default function Slider({ label, value, set, min, max, step, unit = "", color = T.accent, info }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min) * 100)));
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontSize: 10, color: T.gray, letterSpacing: .5, textTransform: "uppercase", display: "flex", alignItems: "center" }}>
          {label}{info && <InfoTip text={info} />}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{fmt(value)}{unit}</span>
      </div>
      <div style={{ position: "relative", height: 4, background: T.border, borderRadius: 2 }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`,
          background: `linear-gradient(90deg,${T.blue},${color})`, borderRadius: 2 }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => set(+e.target.value)}
          style={{ position: "absolute", top: -7, left: 0, width: "100%", opacity: 0, height: 18, cursor: "pointer", zIndex: 2 }} />
        <div style={{ position: "absolute", top: -5, left: `calc(${pct}% - 7px)`,
          width: 14, height: 14, borderRadius: "50%", background: color,
          boxShadow: `0 0 0 3px ${color}33`, pointerEvents: "none" }} />
      </div>
    </div>
  );
}
