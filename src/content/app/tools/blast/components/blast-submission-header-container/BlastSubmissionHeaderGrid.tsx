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

import styles from './BlastSubmissionHeaderGrid.scss';

/**
 * This is a dumb component whose sole purpose is to arrange the children into a grid
 */

// TODO: consider which interface is better: a single "children" prop,
// or individual "first", "second", "third" props. With individual props,
// the consumer of the component will know that this component accepts only three children
type Props = {
  children: ReactNode;
};

const BlastSubmissionHeaderGrid = ({ children }: Props) => {
  return <div className={styles.grid}>{children}</div>;
};

export default BlastSubmissionHeaderGrid;