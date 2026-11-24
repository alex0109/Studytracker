// "Put the letters in order": a word split into letters to move and what stays in place
// (spaces, hyphens, apostrophes), with the letters shuffled into tiles

export interface ILetterPuzzle {
  // The word as it is shown: a letter's place, or a character that stays put
  layout: { char: string; letter: number | null }[];
  // The letters in the right order
  letters: string[];
  // The same letters, shuffled; a tile's id is its place in this list
  tiles: string[];
}

// For every letter place, the tile put there, or null while it's empty
export type LetterPlacement = (number | null)[];

const MIN_LETTERS = 2;
// Longer phrases are tedious to put together letter by letter
const MAX_LETTERS = 16;

const isLetter = (char: string) => /[\p{L}\p{N}]/u.test(char);

// Letters as a reader sees them: "й" or "é" written with a combining mark is still one tile
const graphemes = (text: string): string[] => {
  const normalized = text.normalize("NFC").trim();
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(normalized), (part) => part.segment);
  }
  return Array.from(normalized);
};

const same = (a: string, b: string) => a.toLocaleLowerCase() === b.toLocaleLowerCase();

// A word worth a puzzle: two letters at least, not all the same, not a long phrase
export const canMakeLetterPuzzle = (term: string): boolean => {
  const letters = graphemes(term).filter(isLetter);
  return (
    letters.length >= MIN_LETTERS &&
    letters.length <= MAX_LETTERS &&
    new Set(letters.map((letter) => letter.toLocaleLowerCase())).size > 1
  );
};

export const makeLetterPuzzle = (term: string, random: () => number = Math.random): ILetterPuzzle => {
  let next = 0;
  const layout = graphemes(term).map((char) => ({ char, letter: isLetter(char) ? next++ : null }));
  const letters = layout.filter((item) => item.letter !== null).map((item) => item.char);

  const shuffle = () => {
    const tiles = [...letters];
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    return tiles;
  };
  const isTheWord = (tiles: string[]) => tiles.every((tile, index) => same(tile, letters[index]));

  // The tiles never spell the word already
  let tiles = shuffle();
  for (let tries = 0; tries < 10 && isTheWord(tiles); tries++) tiles = shuffle();
  if (isTheWord(tiles)) tiles = [...tiles.slice(1), tiles[0]];

  return { layout, letters, tiles };
};

export const isComplete = (placement: LetterPlacement) => placement.every((tile) => tile !== null);

// Letter places that hold a tile of another letter
export const wrongPlaces = (puzzle: ILetterPuzzle, placement: LetterPlacement): number[] =>
  placement.flatMap((tile, place) => (tile !== null && !same(puzzle.tiles[tile], puzzle.letters[place]) ? [place] : []));

export const isSolved = (puzzle: ILetterPuzzle, placement: LetterPlacement) =>
  isComplete(placement) && wrongPlaces(puzzle, placement).length === 0;

// One step closer: the first empty or wrong place gets its right letter, taken from the free
// tiles or from a place where it was wrong. Enough hints always solve the puzzle
export const placeHint = (puzzle: ILetterPuzzle, placement: LetterPlacement): LetterPlacement => {
  const wrong = new Set(wrongPlaces(puzzle, placement));
  const place = placement.findIndex((tile, index) => tile === null || wrong.has(index));
  if (place === -1) return placement;

  const used = new Set(placement.filter((tile): tile is number => tile !== null));
  const fits = (tile: number) => same(puzzle.tiles[tile], puzzle.letters[place]);
  const free = puzzle.tiles.findIndex((_, tile) => !used.has(tile) && fits(tile));
  const fromWrong = placement.findIndex((tile, index) => tile !== null && index !== place && wrong.has(index) && fits(tile));

  const next = [...placement];
  let tile = free;
  if (tile === -1 && fromWrong !== -1) {
    tile = next[fromWrong]!;
    next[fromWrong] = null;
  }
  if (tile === -1) return placement;

  next[place] = tile;
  return next;
};
