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

import { useEffect, useState } from 'react';
import classNames from 'classnames';

import Checkmark from 'static/icons/icon_tick.svg';

import styles from './Copy.module.css';

type Props = {
  value: string;
  onCopy?: () => void;
  className?: string;
};

const Copy = (props: Props) => {
  const [copied, setCopied] = useState(false);

  let timeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    return () => timeout && clearTimeout(timeout);
  }, []);

  const copy = () => {
    setCopied(true);
    props.onCopy?.();
    navigator.clipboard.writeText(props.value);

    timeout = setTimeout(() => setCopied(false), 1500);
  };

  // check if the browser exposes the clipboard api (it won't be available e.g. over http)
  // (using globalThis to query the navigator so as not to explode if this component is ever rendered on the server)
  if (!globalThis?.navigator?.clipboard) {
    // do not display the Copy button in the environments where it is unusable
    return null;
  }

  const componentStyles = classNames(
    styles.copy,
    {
      [styles.copied]: copied
    },
    props.className
  );

  return (
    <button className={componentStyles} onClick={copy}>
      <span className={styles.copyText}>Copy</span>
      {copied && <Checkmark className={styles.checkmark} />}
    </button>
  );
};

export default Copy;
