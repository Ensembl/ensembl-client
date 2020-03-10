import pluralDictionary from '../data/pluralisedNouns';

export default function pluralise(word: string, count: number) {
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
