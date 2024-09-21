export default function roundAndReturnPositive(value: number): number {
  return Math.max(Math.round(value), 0);
}
