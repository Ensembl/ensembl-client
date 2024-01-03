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

import React, { type ReactNode } from 'react';

import styles from './SpeciesTabsWrapper.module.css';

type Props = {
  children: ReactNode;
};

/**
 * NOTE:
 * This is a temporary component, to position species tabs slider
 * next to the "Change" link that opens Species Selector.
 * The "Change" link is expected to go away
 */

const SpeciesTabsWrapper = (props: Props) => {
  return <div className={styles.grid}>{props.children}</div>;
};

export default SpeciesTabsWrapper;
