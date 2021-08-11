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

import QuestionButton from 'src/shared/components/question-button/QuestionButton';

import { getTranscriptMetadata } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { TranscriptMetadata } from 'src/shared/types/thoas/metadata';

import styles from './TranscriptQualityLabel.scss';

type Props = {
  metadata: Pick<TranscriptMetadata, 'canonical' | 'mane'>;
};

export const TranscriptQualityLabel = (props: Props) => {
  const metadata = getTranscriptMetadata(props.metadata);
  if (!metadata) {
    return null;
  }

  return (
    <div className={styles.transcriptQualityLabel}>
      <span>{metadata.label}</span>
      <QuestionButton helpText={metadata.definition} />
    </div>
  );
};
