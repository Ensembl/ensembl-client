import React from 'react';
import zip from 'lodash/zip';
import last from 'lodash/last';

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

const SpeciesSearchMatch = ({ match }: Props) => {
  const commonName = <CommonName match={match} />;
  return (
    <div className={styles.speciesSearchMatch}>
      {match.description}
      {commonName}
    </div>
  );
};

const CommonName = ({ match }: Props) => {
  const { description, matched_substrings } = match;
  console.log(
    splitMatch({ string: description, matchedSubsctrings: matched_substrings })
  );
  return <p />;
};

const splitMatch = ({ string, matchedSubsctrings }: SplitterProps) => {
  const matchStartIndices = matchedSubsctrings.map(({ offset }) => offset);
  const matchEndIndices = matchedSubsctrings.map(
    ({ offset, length }) => offset + length
  );
  const matchIndices = zip(matchStartIndices, matchEndIndices);
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
  }, []);
};

export default SpeciesSearchMatch;
