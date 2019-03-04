import React, { useState } from 'react';
import classNames from 'classnames';

import styles from './Input.scss';

type PropsForRespondingWithEvents = {
  onChange: (e: React.ChangeEvent<any>) => void;
  callbackWithEvent: true;
};

type PropsForRespondingWithData = {
  onChange: (value: string) => void;
  callbackWithEvent: false;
};

type OnChangeProps = PropsForRespondingWithEvents | PropsForRespondingWithData;

type Props = {
  id?: string;
  name?: string;
  type?: string;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string; // to customize input styling when using CSS modules
} & OnChangeProps;

const Input = (props: Props) => {
  // FIXME: Should we use initial value from props?
  // Should the value be completely controllable via props?
  const [value, setValue] = useState('');

  const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
    if (props.callbackWithEvent) {
      props.onChange(e);
    } else {
      props.onChange(value);
    }
  };

  const className = classNames(styles.input, props.className);

  return (
    <input
      id={props.id}
      name={props.name}
      type={props.type || 'text'}
      autoFocus={props.autoFocus}
      placeholder={props.placeholder}
      className={className}
      value={value}
      onChange={updateValue}
    />
  );
};

Input.defaultProps = {
  callbackWithEvent: false
};

export default Input;
