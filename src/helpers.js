export const r = n => Math.round(n);
export const fmt = n => new Intl.NumberFormat("ru-RU").format(r(n));
export const fmtM = n => n >= 1e6 ? `${(n / 1e6).toFixed(2)} млн ` + String.fromCharCode(8381) : `${fmt(n)} ` + String.fromCharCode(8381);
export const fK = n => r(n / 1000);
export const RUB = String.fromCharCode(8381);
