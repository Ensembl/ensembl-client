/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import classNames from 'classnames';
import zip from 'lodash/zip';
import sortBy from 'lodash/sortBy';

import {
  MatchedFieldName,
  type SearchMatch,
  type MatchedSubstring
} from 'src/content/app/species-selector/types/species-search';

import styles from './SpeciesSearchMatch.scss';

type Props = {
  match: SearchMatch;
};

type SplitterProps = {
  string: string;
  matchedSubstrings: MatchedSubstring[];
};

type FormattedLabelProps = {
  match: SearchMatch;
  matchedFieldName: MatchedFieldName;
  className?: string;
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
      <AssemblyName match={match} />
      <ScientificName match={match} />
    </div>
  );
};

const FormattedLabel = (props: FormattedLabelProps) => {
  const field = props.match[props.matchedFieldName];
  const { matched_substrings } = props.match;

  const matches = matched_substrings.filter(
    ({ match }) => match === props.matchedFieldName
  );

  if (field) {
    const substrings = sortBy(
      splitMatch({
        string: field,
        matchedSubstrings: matches
      }),
      ({ start }) => start
    );

    return (
      <span className={props.className}>
        {formatString({ string: field, substrings })}
      </span>
    );
  } else {
    return null;
  }
};

const CommonName = (props: Props) => {
  return (
    <FormattedLabel
      match={props.match}
      matchedFieldName={MatchedFieldName.COMMON_NAME}
    />
  );
};

const AssemblyName = (props: Props) => {
  return (
    <FormattedLabel
      match={props.match}
      matchedFieldName={MatchedFieldName.ASSEMBLY_NAME}
      className={styles.assemblyName}
    />
  );
};

const ScientificName = (props: Props) => {
  return (
    <FormattedLabel
      match={props.match}
      matchedFieldName={MatchedFieldName.SCIENTIFIC_NAME}
      className={styles.scientificName}
    />
  );
};

const formatString = ({ string, substrings }: FormatStringProps) =>
  substrings.length
    ? substrings.map(({ start, end, isMatch }) => (
        <span
          className={classNames({
            [styles.matched]: isMatch
          })}
          key={`${start}-${end}`}
        >
          {string.substring(start, end)}
        </span>
      ))
    : string;

const splitMatch = ({ string, matchedSubstrings }: SplitterProps) => {
  const matchStartIndices = matchedSubstrings.map(({ offset }) => offset);
  const matchEndIndices = matchedSubstrings.map(
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
      currentEndIndex <= string.length - 1
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
