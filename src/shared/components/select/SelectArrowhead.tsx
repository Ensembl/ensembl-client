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

import styles from './Select.scss';

export enum Direction {
  UP = 'up',
  DOWN = 'down'
}

type Props = {
  direction: Direction;
};

const SelectArrowhead = (props: Props) => {
  const points =
    props.direction === Direction.DOWN ? '0,0 8,0 4,8' : '0,8 8,8 4,0';

  return (
    <svg className={styles.selectArrowhead} focusable="false" viewBox="0 0 8 8">
      <polygon points={points} />
    </svg>
  );
};

SelectArrowhead.defaultProps = {
  direction: Direction.DOWN
};

export default SelectArrowhead;
