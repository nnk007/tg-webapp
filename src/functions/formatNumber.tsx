export function formatNumber(number: number): string {
  const exp = Math.log10(number);
  if (exp < 3) return `${number}`;
  else if (exp <= 5) return `${(number / (10 ** 3)).toFixed(3)}K`;
  else if (exp <= 7) return `${(number / (10 ** 6)).toFixed(3)}M`;
  // else return `${exp}`;
  else return (`$$$`);
}
