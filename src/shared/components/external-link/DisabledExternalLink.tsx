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

import classNames from 'classnames';
import type { ReactNode } from 'react';

import LinkIcon from 'static/icons/icon_xlink.svg';

import styles from './DisabledExternalLink.module.css';

/**
 * It's very rare that one would need to use this component.
 * Links are not something that tend to get disabled.
 * But in the rare case that it needs to happen, it's easier
 * to have a dedicated component for this purpose than to modify
 * the regular ExternalLink component using CSS
 */

type Props = {
  children: ReactNode;
  className?: string;
};

const DisabledExternalLink = (props: Props) => {
  const componentClasses = classNames(styles.container, props.className);

  return (
    <span className={componentClasses}>
      <LinkIcon className={styles.icon} />
      <span className={styles.text}>{props.children}</span>
    </span>
  );
};

export default DisabledExternalLink;
