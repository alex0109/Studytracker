// Helpers for "select a word while reading": nothing here touches the document

const SENTENCE_END = /[.!?…]/;
const MAX_SENTENCE = 300;

// The sentence of a block's text that holds [start, end). Long sentences are cut around the
// selection, so the example still shows where the word stood
export const sentenceAround = (text: string, start: number, end: number): string => {
  let from = start;
  while (from > 0 && !(SENTENCE_END.test(text[from - 1]) && /\s/.test(text[from] ?? ""))) from--;

  let to = end;
  while (to < text.length && !SENTENCE_END.test(text[to])) to++;
  if (to < text.length) to++;
  while (to < text.length && /["»”)]/.test(text[to])) to++;

  let sentence = text.slice(from, to).replace(/\s+/g, " ").trim();
  if (sentence.length > MAX_SENTENCE) {
    const middle = Math.max(0, start - from - MAX_SENTENCE / 2);
    sentence = sentence.slice(middle, middle + MAX_SENTENCE).trim();
  }

  return sentence;
};

export const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

const BLOCK = "p, li, h1, h2, h3, h4, h5, h6, blockquote, td, th, pre";

// The selection's sentence, read from the block it starts in
export const sentenceOfRange = (range: Range, container: HTMLElement): string => {
  const startElement =
    range.startContainer instanceof Element ? range.startContainer : range.startContainer.parentElement;
  const block = startElement?.closest(BLOCK);
  const root = block && container.contains(block) ? block : container;

  const before = document.createRange();
  before.setStart(root, 0);
  before.setEnd(range.startContainer, range.startOffset);
  const start = before.toString().length;

  return sentenceAround(root.textContent ?? "", start, start + range.toString().length);
};

const FLASH = "word-added";
const FLASH_STYLE_ID = "word-added-highlight";

// The paint lives here, not in globals.css: Next's CSS minifier doesn't know ::highlight()
// and warned on every build. Added once, the first time a word flashes
const ensureFlashStyle = () => {
  if (document.getElementById(FLASH_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = FLASH_STYLE_ID;
  style.textContent = `::highlight(${FLASH}) { background-color: rgb(16 185 129 / 0.35); }`;
  document.head.append(style);
};

// Marks a range for a moment with the CSS Custom Highlight API: painted over the text,
// the document itself is not changed, so nothing is saved. Browsers without it skip the flash
export const flashRange = (range: Range, durationMs = 1600) => {
  const css = globalThis.CSS as unknown as { highlights?: Map<string, unknown> } | undefined;
  const HighlightType = (globalThis as unknown as { Highlight?: new (...ranges: Range[]) => unknown }).Highlight;
  if (!css?.highlights || !HighlightType) return;

  ensureFlashStyle();
  css.highlights.set(FLASH, new HighlightType(range));
  setTimeout(() => css.highlights?.delete(FLASH), durationMs);
};
