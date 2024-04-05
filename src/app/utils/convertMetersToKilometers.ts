export default function metersToKilometers(meters: number): string {
  // 1 kilometer = 1000 meters
  return `${(meters / 1000).toFixed(0)}km`;
}
