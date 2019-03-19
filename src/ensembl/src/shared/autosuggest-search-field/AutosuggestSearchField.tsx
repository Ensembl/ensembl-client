import React, { useState, useEffect, ReactNode } from 'react';
import classNames from 'classnames';

import SearchField from 'src/shared/search-field/SearchField';
import AutosuggestionPanel, {
  GroupOfMatchesProps
} from './AutosuggestionPanel';

import styles from './AutosuggestSearchField.scss';

type Props = {
  search: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  rightCorner?: ReactNode;
  className?: string;
  matchGroups: GroupOfMatchesProps[];
};

const AutosuggestSearchField = (props: Props) => {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(false);
  }, [props.search]);

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
      {Boolean(props.matchGroups.length) && !isSelected && (
        <AutosuggestionPanel matchGroups={props.matchGroups} />
      )}
    </div>
  );
};

AutosuggestSearchField.defaultProps = {
  matchGroups: []
};

export default AutosuggestSearchField;
