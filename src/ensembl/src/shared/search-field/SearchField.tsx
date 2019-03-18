import React, { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './SearchField.scss';

import Input from 'src/shared/input/Input';

type Props = {
  search: string;
  placeholder?: string;
  onChange: (value: string) => void;
  rightCorner?: ReactNode;
  className?: string;
};

const SearchField = (props: Props) => {
  const { rightCorner } = props;
  const className = classNames(styles.searchField, props.className);

  return (
    <div className={className}>
      <Input
        value={props.search}
        onChange={props.onChange}
        className={styles.searchFieldInput}
      />
      {rightCorner && (
        <div className={styles.searchFieldRightCorner}>{rightCorner}</div>
      )}
    </div>
  );
};

export default SearchField;
