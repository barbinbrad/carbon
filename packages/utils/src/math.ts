export const clip = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
