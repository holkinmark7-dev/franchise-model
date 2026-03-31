import { T } from '../../theme';

export default function AddonBadge({ price }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px",
      borderRadius: 20, background: T.goldDim, border: `1px solid ${T.goldBorder}`,
    }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: T.gold, letterSpacing: .5 }}>Доп. модуль</span>
      <span style={{ fontSize: 10, color: T.gray }}>{price}</span>
    </div>
  );
}
