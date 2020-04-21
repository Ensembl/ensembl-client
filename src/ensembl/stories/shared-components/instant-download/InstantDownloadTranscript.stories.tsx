import React, { useState } from 'react';

import { createGene } from 'tests/fixtures/entity-viewer/gene';
import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';

import { InstantDownloadTranscript } from 'src/shared/components/instant-download';

import styles from './InstantDownload.stories.scss';

const buildProteinCodingGene = () => {
  const transcript = createTranscript({
    id: 'ENST00000496384',
    so_term: 'protein_coding'
  });
  const gene = createGene({
    id: 'ENSG00000157764',
    so_term: 'protein_coding',
    transcripts: [transcript]
  });
  return gene;
};

const buildNonProteinCodingGene = () => {
  return createGene();
};

type Layout = 'horizontal' | 'vertical';
type TranscriptType = 'coding' | 'non-coding';

const InstantDownloadTranscriptStory = () => {
  const [layout, setLayout] = useState<Layout>('horizontal');
  const [transcriptType, setTranscriptType] = useState<TranscriptType>(
    'coding'
  );

  const gene =
    transcriptType === 'coding'
      ? buildProteinCodingGene()
      : buildNonProteinCodingGene();

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
          gene={gene}
          transcript={gene.transcripts[0]}
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

export default InstantDownloadTranscriptStory;
