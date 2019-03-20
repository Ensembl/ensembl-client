import React, { useState, useEffect, useRef, ReactNode } from 'react';
import classNames from 'classnames';

import SearchField from 'src/shared/search-field/SearchField';
import AutosuggestionPanel, { GroupOfMatchesType } from './AutosuggestionPanel';

import styles from './AutosuggestSearchField.scss';

type Props = {
  search: string;
  onChange: (value: string) => void;
  onSelect: (match: any) => void;
  matchGroups: GroupOfMatchesType[];
  canShowSuggestions: boolean;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  rightCorner?: ReactNode;
  className?: string;
};

const AutosuggestSearchField = (props: Props) => {
  const [isSelected, setIsSelected] = useState(false);
  const [canShowSuggesions, setCanShowSuggestions] = useState(true);
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsSelected(false);
  }, [props.search]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      const currentElement = element.current;
      if (!currentElement) return;

      if (
        event.target !== currentElement &&
        !currentElement.contains(event.target)
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

  const handleChange = (value: string) => {
    if (value !== props.search) {
      props.onChange(value);
    }
  };

  const shouldShowSuggestions =
    props.search &&
    Boolean(props.matchGroups.length) &&
    canShowSuggesions &&
    !isSelected &&
    props.canShowSuggestions;

  const className = classNames(
    styles.autosuggestionSearchField,
    props.className
  );

  return (
    <div ref={element} className={className}>
      <SearchField
        search={props.search}
        rightCorner={props.rightCorner}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={styles.searchFieldInput}
      />
      {shouldShowSuggestions && (
        <AutosuggestionPanel
          matchGroups={props.matchGroups}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
};

AutosuggestSearchField.defaultProps = {
  matchGroups: [],
  canShowSuggestions: true
};

export default AutosuggestSearchField;
