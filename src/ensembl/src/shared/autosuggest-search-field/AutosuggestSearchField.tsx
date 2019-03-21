import React, { useState, useEffect, useRef, ReactNode } from 'react';
import classNames from 'classnames';

import SearchField from 'src/shared/search-field/SearchField';
import AutosuggestionPanel, {
  GroupOfMatchesType,
  AutosuggestionPanelRef
} from './AutosuggestionPanel';

import styles from './AutosuggestSearchField.scss';

type CommonProps = {
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

// allow the user to submit precise content of the search field (not only a suggested match)
type PropsAllowingRawDataSubmission = {
  allowRawInputSubmission: true;
  onSubmit: (value: string) => void;
};

// notice no onSubmit prop on this one
type PropsDisallowingRawDataSubmission = {
  allowRawInputSubmission: false;
};

type Props =
  | (CommonProps & PropsAllowingRawDataSubmission)
  | (CommonProps & PropsDisallowingRawDataSubmission);

const AutosuggestSearchField = (props: Props) => {
  const [isSelected, setIsSelected] = useState(false);
  const [canShowSuggesions, setCanShowSuggestions] = useState(true);
  const element = useRef<HTMLDivElement>(null);
  const autosuggestionPanel = useRef<AutosuggestionPanelRef>(null);

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

  const handleSubmit = (value: string) => {
    const higlightedItemIndex =
      autosuggestionPanel.current &&
      autosuggestionPanel.current.getIndexOfHighlightedItem();
    if (!higlightedItemIndex && props.allowRawInputSubmission) {
      props.onSubmit(value);
    } else if (higlightedItemIndex) {
      const [groupIndex, itemIndex] = higlightedItemIndex;
      const match = props.matchGroups[groupIndex].matches[itemIndex];
      props.onSelect(match.data);
    }
    setIsSelected(true);
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
        onSubmit={handleSubmit}
        className={styles.searchFieldInput}
      />
      {shouldShowSuggestions && (
        <AutosuggestionPanel
          ref={autosuggestionPanel}
          matchGroups={props.matchGroups}
          onSelect={handleSelect}
          allowRawInputSubmission={props.allowRawInputSubmission}
        />
      )}
    </div>
  );
};

AutosuggestSearchField.defaultProps = {
  matchGroups: [],
  canShowSuggestions: true,
  allowRawInputSubmission: false
};

export default AutosuggestSearchField;
