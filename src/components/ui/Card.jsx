import { T } from '../../theme';

export default function Card({ children, style = {} }) {
  return (
    <div style={{ background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, ...style }}>{children}</div>
  );
}
