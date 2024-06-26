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

import { createBlastSequenceAlignment } from './blastSequenceAlignmentHelper';
import { simpleStringBlastAlignmentFormatter } from './formatters/simpleStringFormatter';

import type { BlastSequenceAlignmentInput } from './blastSequenceAlignmentTypes';
import type { DatabaseType } from 'src/content/app/tools/blast/types/blastSettings';

import styles from './BlastSequenceAlignment.module.css';

type Props = {
  alignment: BlastSequenceAlignmentInput & { hitId: string };
  blastDatabase: DatabaseType;
};

const BlastSequenceAlignment = (props: Props) => {
  const alignmentLines = createBlastSequenceAlignment(props.alignment);

  const { hitId } = props.alignment;

  const getHitLineLabel = (position: number) => `${hitId}:${position}`;

  const formattedAlignment = simpleStringBlastAlignmentFormatter({
    alignmentLines,
    hitLineStartLabel: getHitLineLabel,
    hitLineEndLabel: getHitLineLabel
  });

  return <pre className={styles.alignment}>{formattedAlignment}</pre>;
};

export default BlastSequenceAlignment;
