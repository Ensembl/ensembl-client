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

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './Copy.scss';

const Copy = (props: { value: string }) => {
  const [copied, setCopied] = useState(false);

  let timeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    return () => timeout && clearTimeout(timeout);
  }, []);

  const copy = () => {
    setCopied(true);
    navigator.clipboard.writeText(props.value);

    timeout = setTimeout(() => setCopied(false), 1500);
  };

  const componentStyles = classNames(styles.copyLozenge, {
    [styles.copyLozengeCopied]: copied
  });

  return (
    <span className={componentStyles}>
      {copied ? (
        'Copied'
      ) : (
        <span className={styles.copy} onClick={copy}>
          Copy
        </span>
      )}
    </span>
  );
};

export default Copy;