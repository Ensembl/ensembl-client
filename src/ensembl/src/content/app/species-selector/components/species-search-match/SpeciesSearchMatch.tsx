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
      <ScientificName match={match} />
    </div>
  );
};

const CommonName = ({ match }: Props) => {
  const { description, matched_substrings } = match;

  const descriptionMatches = matched_substrings.filter(
    ({ match }) => match === 'description'
  );

  const substrings = sortBy(
    splitMatch({ string: description, matchedSubsctrings: descriptionMatches }),
    ({ start }) => start
  );

  return <span>{formatString({ string: description, substrings })}</span>;
};

const ScientificName = ({ match }: Props) => {
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
    if (index === 0 && current[0] > 0) {
      result = [
        ...result,
        {
          start: 0,
          end: current[0],
          isMatch: false
        }
      ];
    }
    result = [
      ...result,
      {
        start: current[0],
        end: current[1],
        isMatch: true
      }
    ];
    if (index === array.length - 1) {
      result = [
        ...result,
        {
          start: current[1],
          end: string.length - 1,
          isMatch: false
        }
      ];
    }
    return result;
  }, accumulator);
};

export default SpeciesSearchMatch;
