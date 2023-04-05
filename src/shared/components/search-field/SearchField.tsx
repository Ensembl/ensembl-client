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

import React, { useCallback, ReactNode, FormEvent } from 'react';

import ShadedInput, {
  type InputSize
} from 'src/shared/components/input/ShadedInput';

type Props = {
  search: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  rightCorner?: ReactNode;
  placeholder?: string;
  className?: string;
  size?: InputSize;
};

const SearchField = (props: Props) => {
  const onChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      props.onChange(event.currentTarget.value);
    },
    [props.onChange]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    props.onSubmit && props.onSubmit(props.search);
  };

  return (
    <form
      className={props.className}
      data-test-id="search-field"
      onSubmit={handleSubmit}
    >
      <ShadedInput
        value={props.search}
        placeholder={props.placeholder}
        onChange={onChange}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onKeyUp={props.onKeyUp}
        onKeyDown={props.onKeyDown}
        onKeyPress={props.onKeyPress}
        inputSize={props.size}
        rightCorner={props.rightCorner}
      />
    </form>
  );
};

export default SearchField;
