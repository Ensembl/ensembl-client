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

import React, { useState, type ChangeEventHandler } from 'react';
import classNames from 'classnames';

import FlatInput from 'src/shared/components/input/FlatInput';

import styles from './Input.stories.module.css';

const placeholderText = 'Type here....';
const helpText = 'Shows some text when hovered over';
const defaultMinLength = 3;

export const FlatInputPlayground = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [minLength, setMinLength] = useState<number | undefined>(undefined);
  const [withPlaceholder, setWithPlaceholder] = useState(false);
  const [withHelp, setWithHelp] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  const wrapperClasses = classNames(styles.flatInputWrapper, styles.greyStage);

  return (
    <div>
      <div className={wrapperClasses}>
        <h1>Flat Input Playground</h1>
        <FlatInput
          disabled={isDisabled}
          placeholder={withPlaceholder ? placeholderText : undefined}
          minLength={minLength}
          help={withHelp ? helpText : undefined}
          type={isSearch ? 'search' : 'text'}
        />
      </div>
      <div>
        <Options
          withPlaceholder={withPlaceholder}
          setWithPlaceholder={setWithPlaceholder}
          isDisabled={isDisabled}
          setIsDisabled={setIsDisabled}
          minLength={minLength}
          setMinLength={setMinLength}
          withHelp={withHelp}
          setWithHelp={setWithHelp}
          isSearch={isSearch}
          setIsSearch={setIsSearch}
        />
      </div>
    </div>
  );
};

const Options = (props: {
  withPlaceholder: boolean;
  setWithPlaceholder: (x: boolean) => void;
  isDisabled: boolean;
  setIsDisabled: (x: boolean) => void;
  minLength: number | undefined;
  setMinLength: (x: number | undefined) => void;
  withHelp: boolean;
  setWithHelp: (x: boolean) => void;
  isSearch: boolean;
  setIsSearch: (x: boolean) => void;
}) => {
  const [minLength, setMinLength] = useState(defaultMinLength);

  const onMinimumLengthToggle = () => {
    if (!props.minLength) {
      props.setMinLength(minLength);
    } else {
      props.setMinLength(undefined);
    }
  };

  const onMinimumLengthChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = parseInt(e.currentTarget.value);
    setMinLength(value);
    props.setMinLength(value);
  };

  return (
    <div className={styles.shadedInputOptions}>
      <h2>Options</h2>
      <label>
        Has placeholder
        <input
          type="checkbox"
          checked={props.withPlaceholder}
          onChange={() => props.setWithPlaceholder(!props.withPlaceholder)}
        />
      </label>
      <label>
        With help
        <input
          type="checkbox"
          checked={props.withHelp}
          onChange={() => props.setWithHelp(!props.withHelp)}
        />
      </label>
      <label>
        With clear button
        <input
          type="checkbox"
          checked={props.isSearch}
          onChange={() => props.setIsSearch(!props.isSearch)}
        />
      </label>
      <label>
        With minimum input length
        <input
          type="checkbox"
          checked={props.minLength !== undefined}
          onChange={onMinimumLengthToggle}
        />
        <input
          type="number"
          disabled={props.minLength === undefined}
          value={props.minLength}
          onChange={onMinimumLengthChange}
        />
      </label>
      <label>
        Is disabled
        <input
          type="checkbox"
          checked={props.isDisabled}
          onChange={() => props.setIsDisabled(!props.isDisabled)}
        />
      </label>
    </div>
  );
};
