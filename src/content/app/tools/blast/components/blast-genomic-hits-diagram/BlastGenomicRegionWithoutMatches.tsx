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

import {
  BACKBONE_HEIGHT,
  BACKBONE_Y,
  ELEMENT_HEIGHT
} from './blastGenomicHitsDiagramConstants';

import styles from './BlastGenomicHitsDiagram.module.css';

type Props = {
  width: number;
};

const RegionWithoutMatches = (props: Props) => {
  const { width } = props;

  return (
    <svg viewBox={`0 0 ${width} ${ELEMENT_HEIGHT}`} width={width}>
      <rect
        x={0}
        y={BACKBONE_Y}
        className={styles.backbone}
        width={width}
        height={BACKBONE_HEIGHT}
      />
    </svg>
  );
};

export default RegionWithoutMatches;
