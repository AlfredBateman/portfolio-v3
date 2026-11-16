// No text on this site waits for a script: there are no reveals. What is left is the shared 45° offset that the page
// transition's label travels along.

/** The shared entrance offset in px for `el`: --ne (tokens.css) times its line height. Enter from (-d, d), leave to (d, -d). */
export function neOffset(el: Element) {
  const cs = getComputedStyle(el);
  const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2; // 'normal' has no px value
  return parseFloat(cs.getPropertyValue('--ne')) * lh;
}
