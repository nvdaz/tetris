function clamp(min: number, val: number, max: numer) {
  return Math.max(min, Math.min(max, val));
}

export default clamp;
