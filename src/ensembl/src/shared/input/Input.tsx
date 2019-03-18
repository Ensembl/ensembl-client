import React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import styles from './Input.scss';

type PropsForRespondingWithEvents = {
  onChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  onFocus: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  onBlur: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  callbackWithEvent: true;
};

type PropsForRespondingWithData = {
  onChange: (value: string) => void;
  onFocus: (value?: string) => void;
  onBlur: (value?: string) => void;
  callbackWithEvent: false;
};

type OnChangeProps = PropsForRespondingWithEvents | PropsForRespondingWithData;

type Props = {
  value: string | number;
  id?: string;
  name?: string;
  type?: string;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string; // to customize input styling when using CSS modules
} & OnChangeProps;

const Input = (props: Props) => {
  const eventHandler = (eventName: string) => (
    e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    if (eventName === 'change') {
      props.callbackWithEvent ? props.onChange(e) : props.onChange(value);
    } else if (eventName === 'focus') {
      props.callbackWithEvent ? props.onFocus(e) : props.onFocus(value);
    } else if (eventName === 'blur') {
      props.callbackWithEvent ? props.onBlur(e) : props.onBlur(value);
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
      value={props.value}
      onChange={eventHandler('change')}
      onFocus={eventHandler('focus')}
      onBlur={eventHandler('blur')}
    />
  );
};

Input.defaultProps = {
  callbackWithEvent: false,
  onFocus: noop,
  onBlur: noop
};

export default Input;
