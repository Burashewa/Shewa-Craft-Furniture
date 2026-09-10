export function readSearch(value) {
  return String(value || '').trim().slice(0, 100);
}
