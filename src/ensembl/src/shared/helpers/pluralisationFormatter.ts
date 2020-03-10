type PluralDictionary = {
  [key: string]: string;
};

const pluralDictionary: PluralDictionary = {
  species: 'species'
};

export function pluralise(word: string, count: number) {
  if (count === 1) {
    return word;
  } else {
    if (word in pluralDictionary) {
      return pluralDictionary[word];
    } else {
      return `${word}s`;
    }
  }
}
