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

import React, { useState } from 'react';

import { createGene } from 'tests/fixtures/entity-viewer/gene';
import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';

import { InstantDownloadTranscript } from 'src/shared/components/instant-download';

import styles from './InstantDownload.stories.scss';

const buildProteinCodingGene = () => {
  const transcript = createTranscript({
    unversioned_stable_id: 'ENST00000496384'
  });
  const gene = createGene({
    unversioned_stable_id: 'ENSG00000157764',
    transcripts: [transcript]
  });
  return gene;
};

const buildNonProteinCodingGene = () => {
  return createGene();
};

type Layout = 'horizontal' | 'vertical';
type TranscriptType = 'coding' | 'non-coding';

export const InstantDownloadTranscriptStory = () => {
  const [layout, setLayout] = useState<Layout>('horizontal');
  const [transcriptType, setTranscriptType] =
    useState<TranscriptType>('coding');

  const gene =
    transcriptType === 'coding'
      ? buildProteinCodingGene()
      : buildNonProteinCodingGene();
  const transcript = gene.transcripts[0];

  const horizontalContainerProps = {
    className: styles.containerBlack,
    style: {
      width: '695px'
    }
  };

  const verticalContainerProps = {
    className: styles.containerBlack,
    style: {
      width: '270px'
    }
  };

  const containerProps =
    layout === 'horizontal' ? horizontalContainerProps : verticalContainerProps;

  return (
    <div className={styles.transcriptStoryContainer}>
      <div {...containerProps}>
        <InstantDownloadTranscript
          layout={layout}
          gene={{ id: gene.unversioned_stable_id }}
          transcript={{
            id: transcript.unversioned_stable_id,
            biotype: transcript.metadata.biotype?.value as string
          }}
        />
      </div>
      <StoryOptions
        currentLayout={layout}
        onLayoutChange={setLayout}
        currentTranscriptType={transcriptType}
        onTranscriptTypeChange={setTranscriptType}
      />
    </div>
  );
};

type StoryOptionsProps = {
  currentLayout: Layout;
  onLayoutChange: (layout: Layout) => void;
  currentTranscriptType: TranscriptType;
  onTranscriptTypeChange: (type: TranscriptType) => void;
};

const StoryOptions = (props: StoryOptionsProps) => {
  return (
    <div className={styles.optionsContainer}>
      <div className={styles.optionsGroup}>
        <div className={styles.optionsGroupHeading}>Layout</div>
        <label>
          <input
            type="radio"
            checked={props.currentLayout === 'horizontal'}
            onChange={() => props.onLayoutChange('horizontal')}
          />
          Horizontal
        </label>
        <label>
          <input
            type="radio"
            checked={props.currentLayout === 'vertical'}
            onChange={() => props.onLayoutChange('vertical')}
          />
          Vertical
        </label>
      </div>
      <div className={styles.optionsGroup}>
        <div className={styles.optionsGroupHeading}>Transcript type</div>
        <label>
          <input
            type="radio"
            checked={props.currentTranscriptType === 'coding'}
            onChange={() => props.onTranscriptTypeChange('coding')}
          />
          Coding
        </label>
        <label>
          <input
            type="radio"
            checked={props.currentTranscriptType === 'non-coding'}
            onChange={() => props.onTranscriptTypeChange('non-coding')}
          />
          Non-coding
        </label>
      </div>
    </div>
  );
};

InstantDownloadTranscriptStory.storyName = 'default';

export default {
  title: 'Components/Shared Components/InstantDownloadTranscript'
};
