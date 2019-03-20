import React, { useState, useEffect, ReactNode } from 'react';
import classNames from 'classnames';

import SearchField from 'src/shared/search-field/SearchField';
import AutosuggestionPanel, { GroupOfMatchesType } from './AutosuggestionPanel';

import styles from './AutosuggestSearchField.scss';

type Props = {
  search: string;
  onChange: (value: string) => void;
  onSelect: (match: any) => void;
  matchGroups: GroupOfMatchesType[];
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  rightCorner?: ReactNode;
  className?: string;
};

const AutosuggestSearchField = (props: Props) => {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(false);
  }, [props.search]);

  const handleSelect = (match: any) => {
    setIsSelected(true);
    props.onSelect(match);
  };

  const className = classNames(
    styles.autosuggestionSearchField,
    props.className
  );

  return (
    <div className={className}>
      <SearchField
        search={props.search}
        rightCorner={props.rightCorner}
        onChange={props.onChange}
        className={styles.searchFieldInput}
      />
      {props.search && Boolean(props.matchGroups.length) && !isSelected && (
        <AutosuggestionPanel
          matchGroups={props.matchGroups}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
};

AutosuggestSearchField.defaultProps = {
  matchGroups: []
};

export default AutosuggestSearchField;
