import React from 'react';
import classNames from 'classnames';
import zip from 'lodash/zip';
import sortBy from 'lodash/sortBy';

import {
  SearchMatch,
  MatchedSubstring
} from 'src/content/app/species-selector/types/species-search';

import styles from './SpeciesSearchMatch.scss';

type Props = {
  match: SearchMatch;
};

type SplitterProps = {
  string: string;
  matchedSubsctrings: MatchedSubstring[];
};

type FormatStringProps = {
  string: string;
  substrings: SplitSubstring[];
};

type SplitSubstring = {
  start: number;
  end: number;
  isMatch: boolean;
};

type NumberTuple = [number, number];

const SpeciesSearchMatch = ({ match }: Props) => {
  return (
    <div className={styles.speciesSearchMatch}>
      <CommonName match={match} />
      <Subtype match={match} />
      <ScientificName match={match} />
    </div>
  );
};

// TODO: refactor – CommonName, Subtype and ScientificName
// can all use one and the same component (call it Substring)
// that does the splitting and formatting

const CommonName = ({ match }: { match: SearchMatch }) => {
  const { common_name, matched_substrings } = match;

  const commonNameMatches = matched_substrings.filter(
    ({ match }) => match === 'common_name'
  );

  if (common_name) {
    const substrings = sortBy(
      splitMatch({
        string: common_name,
        matchedSubsctrings: commonNameMatches
      }),
      ({ start }) => start
    );

    return <span>{formatString({ string: common_name, substrings })}</span>;
  } else {
    return null;
  }
};

const Subtype = ({ match }: { match: SearchMatch }) => {
  const { subtype, matched_substrings } = match;

  const subtypeMatches = matched_substrings.filter(
    ({ match }) => match === 'subtype'
  );

  if (subtype) {
    const substrings = sortBy(
      splitMatch({ string: subtype, matchedSubsctrings: subtypeMatches }),
      ({ start }) => start
    );

    return (
      <span className={styles.speciesSearchMatchSubtype}>
        {formatString({ string: subtype, substrings })}
      </span>
    );
  } else {
    return null;
  }
};

const ScientificName = ({ match }: { match: SearchMatch }) => {
  const { scientific_name, matched_substrings } = match;

  if (!scientific_name) return null;

  const scientificNameMatches = matched_substrings.filter(
    ({ match }) => match === 'scientific_name'
  );

  const substrings = sortBy(
    splitMatch({
      string: scientific_name,
      matchedSubsctrings: scientificNameMatches
    }),
    ({ start }) => start
  );

  return (
    <span className={styles.speciesSearchMatchScientificName}>
      {formatString({ string: scientific_name, substrings })}
    </span>
  );
};

const formatString = ({ string, substrings }: FormatStringProps) =>
  substrings.length
    ? substrings.map(({ start, end, isMatch }) => (
        <span
          className={classNames({
            [styles.speciesSearchMatchMatched]: isMatch
          })}
          key={`${start}-${end}`}
        >
          {string.substring(start, end)}
        </span>
      ))
    : string;

const splitMatch = ({ string, matchedSubsctrings }: SplitterProps) => {
  const matchStartIndices = matchedSubsctrings.map(({ offset }) => offset);
  const matchEndIndices = matchedSubsctrings.map(
    ({ offset, length }) => offset + length
  );
  const matchIndices = zip(matchStartIndices, matchEndIndices) as NumberTuple[];
  const accumulator: SplitSubstring[] = [];
  return matchIndices.reduce((result, current, index, array) => {
    const [currentStartIndex, currentEndIndex] = current; // notice, currentEndIndex is exclusive
    const nextStartIndex =
      index < array.length - 1 ? array[index + 1][0] : null;

    if (index === 0 && current[0] > 0) {
      // if there is an unmatched part of the string before the first match,
      // add it as the first item in the list of substrings
      result = [
        {
          start: 0,
          end: currentStartIndex,
          isMatch: false
        }
      ];
    }

    // add the matched substring
    result = [
      ...result,
      {
        start: currentStartIndex,
        end: currentEndIndex,
        isMatch: true
      }
    ];

    if (nextStartIndex) {
      // if there is another match in the same string, add the unmatched portion between
      // the current and the next match
      result = [
        ...result,
        {
          start: currentEndIndex,
          end: nextStartIndex,
          isMatch: false
        }
      ];
    } else if (
      index === array.length - 1 &&
      currentEndIndex < string.length - 1
    ) {
      // if there is unmatched trailing portion of the string, add it to the list of substrings
      result = [
        ...result,
        {
          start: currentEndIndex,
          end: string.length,
          isMatch: false
        }
      ];
    }
    return result;
  }, accumulator);
};

export default SpeciesSearchMatch;
