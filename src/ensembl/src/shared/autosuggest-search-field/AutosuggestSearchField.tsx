import React, { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './AutosuggestSearchField.scss';

import SearchField from 'src/shared/search-field/SearchField';

type Props = {
  search: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  rightCorner?: ReactNode;
  className?: string;
};

const AutosuggestSearchField = (props: Props) => {
  const className = classNames(styles.searchField, props.className);

  return (
    <div className={className}>
      <SearchField
        search={props.search}
        rightCorner={props.rightCorner}
        onChange={props.onChange}
        className={styles.searchFieldInput}
      />
    </div>
  );
};

export default AutosuggestSearchField;
