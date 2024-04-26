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

import { useState, useEffect, useRef } from 'react';

import * as React from 'react';
import classNames from 'classnames';

import ShadedInput from 'src/shared/components/input/ShadedInput';
import AutosuggestionPanel, {
  type GroupOfMatchesType,
  type MatchIndex
} from './AutosuggestionPanel';

import styles from './AutosuggestSearchField.module.css';

export const defaultNotFoundText = 'No results found';

type CommonProps = {
  search: string;
  onChange: (value: string) => void;
  onSelect: (match: any) => void;
  matchGroups?: GroupOfMatchesType[];
  canShowSuggestions?: boolean;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  help?: string;
  className?: string;
  searchFieldClassName?: string;
  notFound?: boolean;
  notFoundText?: string;
};

// with this set of props user can submit raw content of the search field
// (not just one of suggested matches)
type PropsAllowingRawDataSubmission = {
  allowRawInputSubmission: true;
  onSubmit: (value: string) => void;
};

// with this set of props user can submit only one of suggested matches
// (notice no onSubmit prop; typescript is smart enough to know it won't be available)
type PropsDisallowingRawDataSubmission = {
  allowRawInputSubmission?: false;
};

type Props =
  | (CommonProps & PropsAllowingRawDataSubmission)
  | (CommonProps & PropsDisallowingRawDataSubmission);

function getNextItemIndex(
  props: Props,
  currentItemIndex: MatchIndex | null
): MatchIndex {
  const { matchGroups = [], allowRawInputSubmission = false } = props;
  const [groupIndex, itemIndex] = currentItemIndex || [null, null];
  const currentGroup =
    typeof groupIndex === 'number' ? matchGroups[groupIndex] : null;
  const firstItemIndex: MatchIndex = [0, 0];

  if (itemIndex === null) {
    return firstItemIndex;
  } else if (currentGroup && itemIndex < currentGroup.matches.length - 1) {
    // move to the next item in the group
    return [groupIndex, itemIndex + 1] as MatchIndex;
  } else if (groupIndex === matchGroups.length - 1) {
    // this is the last item in the last group;
    // either return null if submitting raw input is allowed, or
    // cycle back to the first item in the list
    return allowRawInputSubmission ? null : firstItemIndex;
  } else if (typeof groupIndex === 'number') {
    // move to the next group in the list
    return [groupIndex + 1, 0];
  } else {
    return null; // should never happen, but makes Typescript happy
  }
}

function getPreviousItemIndex(
  props: Props,
  currentItemIndex: MatchIndex | null
): MatchIndex {
  const { matchGroups = [], allowRawInputSubmission } = props;
  const [groupIndex, itemIndex] = currentItemIndex || [null, null];
  const lastGroupIndex = matchGroups.length - 1;
  const lastGroupItemIndex = matchGroups[lastGroupIndex].matches.length - 1;
  const lastItemIndex: MatchIndex = [lastGroupIndex, lastGroupItemIndex];
  if (itemIndex === null) {
    return lastItemIndex;
  } else if (itemIndex > 0) {
    // move to the previous item
    return [groupIndex, itemIndex - 1] as MatchIndex;
  } else if (groupIndex === 0) {
    // this is the first item in the first group;
    // either return null if submitting raw input is allowed,
    // or cycle back to the very last item in the list
    return allowRawInputSubmission ? null : lastItemIndex;
  } else if (typeof groupIndex === 'number') {
    // move to the last item in the previous group
    const previousGroupIndex = groupIndex - 1;
    const lastItemIndex = matchGroups[previousGroupIndex].matches.length - 1;
    return [previousGroupIndex, lastItemIndex];
  } else {
    return null; // should never happen, but makes Typescript happy
  }
}

const AutosuggestSearchField = (props: Props) => {
  const {
    matchGroups = [],
    allowRawInputSubmission = false,
    notFoundText = defaultNotFoundText
  } = props;
  const preventSuggestionsProp = props.canShowSuggestions === false;

  const initialHighlightedItemIndex: MatchIndex = allowRawInputSubmission
    ? null
    : [0, 0];
  const [highlightedItemIndex, setHighlightedItemIndex] = useState(
    initialHighlightedItemIndex
  );
  const [isSelected, setIsSelected] = useState(false);
  const [canShowSuggesions, setCanShowSuggestions] = useState(true);
  const element = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsSelected(false);
  }, [props.search]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      const currentElement = element.current;
      if (!currentElement) return;

      if (
        event.target !== currentElement &&
        !currentElement.contains(event.target as HTMLElement)
      ) {
        setCanShowSuggestions(false);
      }
    };
    window.addEventListener('click', onClickOutside);
    return () => window.removeEventListener('click', onClickOutside);
  }, []);

  const handleSelect = (match: any) => {
    setIsSelected(true);
    props.onSelect(match);
  };

  const handleBlur = () => {
    props.onBlur && props.onBlur();
  };

  const handleFocus = () => {
    if (!canShowSuggesions) {
      setCanShowSuggestions(true);
    }
    props.onFocus && props.onFocus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return;

    event.preventDefault();

    if (event.key === 'ArrowUp') {
      setHighlightedItemIndex(
        getPreviousItemIndex(props, highlightedItemIndex)
      );
    } else {
      setHighlightedItemIndex(getNextItemIndex(props, highlightedItemIndex));
    }
  };

  const handleItemHover = (itemIndex: MatchIndex) => {
    setHighlightedItemIndex(itemIndex);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (value !== props.search) {
      props.onChange(value);
    }
  };

  const handleSubmit = () => {
    const input = inputRef.current as HTMLInputElement;
    const value = input.value;

    if (!highlightedItemIndex && props.allowRawInputSubmission) {
      props.onSubmit(value);
    } else if (highlightedItemIndex) {
      const [groupIndex, itemIndex] = highlightedItemIndex;
      const match = matchGroups[groupIndex]?.matches[itemIndex];

      if (!match) {
        return;
      }

      props.onSelect(match.data);

      setHighlightedItemIndex(initialHighlightedItemIndex);
    }
    setIsSelected(true);
  };

  const shouldShowSuggestions = Boolean(
    props.search &&
      !props.notFound &&
      matchGroups.length > 0 &&
      canShowSuggesions &&
      !isSelected &&
      !preventSuggestionsProp
  );

  const className = classNames(
    styles.autosuggestionSearchField,
    props.className
  );

  return (
    <div ref={element} className={className}>
      <form
        className={styles.autosuggestionSearchFieldWrapper}
        onSubmit={handleSubmit}
      >
        <ShadedInput
          ref={inputRef}
          type="search"
          value={props.search}
          placeholder={props.placeholder}
          onInput={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          help={props.help}
          className={props.searchFieldClassName}
          size="large"
          autoComplete="off"
        />
      </form>
      {shouldShowSuggestions && (
        <AutosuggestionPanel
          highlightedItemIndex={highlightedItemIndex}
          matchGroups={matchGroups}
          onSelect={handleSelect}
          allowRawInputSubmission={allowRawInputSubmission}
          onItemHover={handleItemHover}
        />
      )}
      {props.notFound && (
        <div className={styles.autosuggestionPlate}>{notFoundText}</div>
      )}
    </div>
  );
};

export default AutosuggestSearchField;
