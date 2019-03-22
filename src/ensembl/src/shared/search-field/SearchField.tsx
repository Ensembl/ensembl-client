import React, { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './SearchField.scss';

import Input from 'src/shared/input/Input';

type Props = {
  search: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyUp?: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  rightCorner?: ReactNode;
  className?: string;
};

const SearchField = (props: Props) => {
  const { rightCorner } = props;
  const className = classNames(styles.searchField, props.className);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    props.onSubmit && props.onSubmit(props.search);
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <Input
        value={props.search}
        onChange={props.onChange}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onKeyUp={props.onKeyUp}
        onKeyDown={props.onKeyDown}
        onKeyPress={props.onKeyPress}
        className={styles.searchFieldInput}
      />
      {rightCorner && (
        <div className={styles.searchFieldRightCorner}>{rightCorner}</div>
      )}
    </form>
  );
};

export default SearchField;
