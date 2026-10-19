// Advance widths (em) of Archivo 800 at 125% width with -0.055em tracking, measured in the browser.
// Display titles are sized from their real width so any title fills its line: font-size = N cqi / emWidth.
const ADV: Record<string, number> = {
  A: 0.878, B: 0.859, C: 0.887, D: 0.878, E: 0.808, F: 0.744, G: 0.957, H: 0.934, I: 0.318, J: 0.679,
  K: 0.896, L: 0.699, M: 1.093, N: 0.933, O: 0.958, P: 0.806, Q: 0.958, R: 0.877, S: 0.812, T: 0.793,
  U: 0.913, V: 0.849, W: 1.158, X: 0.885, Y: 0.863, Z: 0.802, ' ': 0.249,
};
export const emWidth = (text: string) =>
  +[...text.toUpperCase()].reduce((sum, c) => sum + (ADV[c] ?? 0.75), 0).toFixed(3);
