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

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import classNames from 'classnames';

import type { TextInputConfig } from './resultsFilterFields';

import styles from './VepResultsFilters.module.css';

type Props = {
  values: string[];
  onChange: (values: string[]) => void;
  config: TextInputConfig;
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
 * more values separated by spaces, commas or newlines. When the field config
 * carries a `pattern`, non-matching tokens are flagged and excluded from the
 * applied filter rather than sent to the server.
 */
const TokenListInput = (props: Props) => {
  const { values, onChange, config } = props;
  const [text, setText] = useState(values.join(', '));

  const isValid = (token: string) =>
    config.pattern ? config.pattern.test(token) : true;
  const validTokens = (input: string) => parseTokens(input).filter(isValid);

  // Resync the field when committed values diverge from what's typed (e.g. the
  // condition is cleared or its field switched, values -> []). Only valid tokens
  // are committed, so compare against those; while typing they already match.
  useEffect(() => {
    if (validTokens(text).join(' ') !== values.join(' ')) {
      setText(values.join(', '));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const onInput = (event: FormEvent<HTMLInputElement>) => {
    const nextText = event.currentTarget.value;
    setText(nextText);
    onChange(validTokens(nextText));
  };

  const invalidTokens = config.pattern
    ? parseTokens(text).filter((token) => !isValid(token))
    : [];

  return (
    <div className={styles.tokenField}>
      <input
        type="text"
        className={classNames(styles.tokenInput, {
          [styles.tokenInputMono]: config.mono,
          [styles.tokenInputInvalid]: invalidTokens.length > 0
        })}
        value={text}
        onInput={onInput}
        placeholder={config.placeholder}
        aria-invalid={invalidTokens.length > 0}
        spellCheck={false}
      />
      {invalidTokens.length > 0 && (
        <span className={styles.tokenError}>
          Ignoring invalid{invalidTokens.length > 1 ? ' ids' : ' id'}:{' '}
          {invalidTokens.join(', ')}
          {config.invalidHint ? ` (${config.invalidHint})` : ''}
        </span>
      )}
    </div>
  );
};

export default TokenListInput;
