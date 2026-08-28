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

import { useState, memo, type InputEvent } from 'react';
import classNames from 'classnames';

import type { FilterField } from 'src/content/app/tools/vep/types/vepResultsFilters';

import styles from './VepResultsFilters.module.css';

type Props = {
  values: string[];
  onChange: (values: string[]) => void;
  config: Pick<FilterField, 'placeholder' | 'mono'>;
};

// Split free text (comma / whitespace / newline separated) into unique tokens,
// preserving order.
const parseTokens = (text: string): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const token of text.split(/[\s,]+/)) {
    if (token && !seen.has(token)) {
      seen.add(token);
      result.push(token);
    }
  }
  return result;
};

/**
 * The value editor for a free-text token field (transcript / gene). Takes one or
 * more values separated by spaces, commas or newlines.
 */
const TokenListInput = (props: Props) => {
  const { values, onChange, config } = props;
  const [prevValues, setPrevValues] = useState(values);
  const [text, setText] = useState(values.join(', '));

  if (values.join('') !== prevValues.join('')) {
    setPrevValues(values);
    setText(values.join(', '));
  }

  const onInput = (event: InputEvent<HTMLInputElement>) => {
    const nextText = event.currentTarget.value;
    setText(nextText);
    onChange(parseTokens(nextText));
  };

  return (
    <div className={styles.tokenField}>
      <input
        type="text"
        className={classNames(styles.tokenInput, {
          [styles.tokenInputMono]: config.mono
        })}
        value={text}
        onInput={onInput}
        placeholder={config.placeholder}
        spellCheck={false}
      />
    </div>
  );
};

export default memo(TokenListInput);
