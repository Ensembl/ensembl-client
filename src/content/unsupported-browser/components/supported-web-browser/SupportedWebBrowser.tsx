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

import React from 'react';

import chromeIconPath from './icons/chrome.svg';
import edgeIconPath from './icons/edge.svg';
import firefoxIconPath from './icons/firefox.svg';
import safariIconPath from './icons/safari.svg';

import styles from './SupportedWebBrowser.scss';

type BrowserName = 'chrome' | 'edge' | 'firefox' | 'safari';

type Props = {
  name: BrowserName;
};

const nameToIconMap = {
  chrome: chromeIconPath,
  firefox: firefoxIconPath,
  safari: safariIconPath,
  edge: edgeIconPath
};

const SupportedWebBrowser = ({ name }: Props) => {
  const iconPath = nameToIconMap[name];

  return (
    <div className={styles.container}>
      <img className={styles.icon} src={iconPath} alt={name} />
      <span className={styles.label}>{name}</span>
    </div>
  );
};

export default SupportedWebBrowser;
