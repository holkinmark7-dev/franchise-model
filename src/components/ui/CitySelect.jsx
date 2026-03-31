import { useState, useMemo, useRef, useEffect } from 'react';
import { T } from '../../theme';
import { fmt } from '../../helpers';
import { ALL_CITIES } from '../../data/cities';

export default function CitySelect({ value, onChange }) {
  const [q, setQ] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const matches = useMemo(() => {
    if (!q || q.length < 1) return ALL_CITIES.slice(0, 10);
    return ALL_CITIES.filter(c => c[0].toLowerCase().includes(q.toLowerCase())).slice(0, 12);
  }, [q]);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input value={q} onChange={e => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)} placeholder="Поиск города..."
        style={{
          width: "100%", padding: "11px 14px", background: T.surface,
          border: `1px solid ${T.border}`, borderRadius: 8, color: T.white,
          fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
        }} />
      {open && matches.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50,
          background: T.card, border: `1px solid ${T.border}`, borderRadius: 8,
          boxShadow: "0 16px 48px rgba(0,0,0,.7)", maxHeight: 260, overflowY: "auto",
        }}>
          {matches.map((c, i) => (
            <div key={i} onClick={() => { setQ(c[0]); onChange(c); setOpen(false); }}
              style={{
                padding: "10px 14px", cursor: "pointer", fontSize: 13, color: T.white,
                borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between",
              }}
              onMouseEnter={e => e.currentTarget.style.background = T.border}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <span>{c[0]}</span>
              <span style={{ fontSize: 10, color: T.gray }}>{fmt(c[1])} чел.</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
