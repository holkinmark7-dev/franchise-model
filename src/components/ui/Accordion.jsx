import { T } from '../../theme';
import Card from './Card';

export default function Accordion({ title, open, onToggle, children, color = T.accent, badge }) {
  return (
    <Card>
      <button onClick={onToggle}
        style={{
          width: "100%", padding: "14px 16px", display: "flex", justifyContent: "space-between",
          alignItems: "center", background: "none", border: "none", cursor: "pointer",
          borderBottom: open ? `1px solid ${T.border}` : "none",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 3, height: 14, background: color, borderRadius: 2 }} />
          <span style={{ fontWeight: 600, color: T.white, fontSize: 13 }}>{title}</span>
          {badge}
        </div>
        <svg width="12" height="12" viewBox="0 0 12 12" style={{ transform: open ? "rotate(180deg)" : "none", transition: ".2s" }}>
          <path d="M2 4 L6 8 L10 4" stroke={T.gray} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </button>
      {open && <div style={{ padding: "14px 16px" }}>{children}</div>}
    </Card>
  );
}
