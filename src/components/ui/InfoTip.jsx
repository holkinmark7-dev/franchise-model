import { useState, useRef, useEffect } from 'react';
import { T } from '../../theme';

export default function InfoTip({ text }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 4 }}>
      <span
        onClick={e => { e.stopPropagation(); setOpen(!open); }}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 16, height: 16, borderRadius: "50%", fontSize: 10, fontWeight: 700, fontStyle: "italic",
          background: open ? `${T.accent}33` : `${T.gray}22`, color: open ? T.accent : T.gray,
          cursor: "pointer", userSelect: "none", lineHeight: 1, fontFamily: "Georgia, serif",
        }}
      >i</span>
      {open && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
          width: 260, padding: "12px 14px", background: T.card, border: `1px solid ${T.accent}44`,
          borderRadius: 10, boxShadow: "0 12px 40px rgba(0,0,0,.7)", zIndex: 100,
          fontSize: 11, color: T.white, lineHeight: 1.6,
        }}>
          {text}
          <div style={{
            position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%) rotate(45deg)",
            width: 10, height: 10, background: T.card, borderRight: `1px solid ${T.accent}44`,
            borderBottom: `1px solid ${T.accent}44`,
          }} />
        </div>
      )}
    </span>
  );
}
