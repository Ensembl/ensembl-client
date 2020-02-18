import React from 'react';

import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import UnsplicedTranscript from 'src/content/app/entity-viewer/gene-view/components/unspliced-transcript/UnsplicedTranscript';

import { OnTicksCalculatedPayload } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';
import { Gene } from 'src/content/app/entity-viewer/types/gene';

import styles from './TranscriptsTable.scss';

type Props = {
  gene: Gene;
  rulerTicks: OnTicksCalculatedPayload;
};

// NOTE: we should make sure that the width of the column is the same as the width of GeneOverviewImage, i.e. 695px

const TranscriptVisualisationColumn = (props: Props) => {
  const { scale } = props.rulerTicks;
  const { start: geneStart } = getFeatureCoordinates(props.gene);

  const renderedTranscripts = props.gene.transcripts.map(
    (transcript, index) => {
      const {
        start: transcriptStart,
        end: transcriptEnd
      } = getFeatureCoordinates(transcript);
      const transcriptStartX = scale(transcriptStart - geneStart); // FIXME In future, this should be done using relative position of transcript in gene
      const transcriptWidth = scale(transcriptEnd - transcriptStart); // FIXME  this too should be based on relative coordinates of transcript
      const style = { transform: `translateX(${transcriptStartX}px)` };
      return (
        <div key={index} style={style}>
          <UnsplicedTranscript
            transcript={transcript}
            width={transcriptWidth}
            standalone={true}
          />
        </div>
      );
    }
  );

  return (
    <div className={styles.transcriptVisualisationColumnWrapper}>
      <StripedBackground {...props} />
      <div
        className={styles.transcriptVisualisationColumn}
        style={{ width: '695px' }}
      >
        {renderedTranscripts}
      </div>
    </div>
  );
};

const StripedBackground = (props: Props) => {
  const { scale, ticks } = props.rulerTicks;
  const { start: geneStart, end: geneEnd } = getFeatureCoordinates(props.gene);
  const geneLength = geneEnd - geneStart; // FIXME should use gene length property
  const extendedTicks = [1, ...ticks, geneLength];

  const stripes = extendedTicks.map((tick) => {
    const x = Math.floor(scale(tick));
    const style = { left: `${x}px` };
    return <span key={x} className={styles.stripe} style={style} />;
  });

  return <div className={styles.stripedBackground}>{stripes}</div>;
};

export default TranscriptVisualisationColumn;
