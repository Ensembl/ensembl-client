import React from 'react';
import sortBy from 'lodash/sortBy';

import {
  getFeatureCoordinates,
  getFeatureLength
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import DefaultTranscriptsListItem from './default-transcripts-list-item/DefaultTranscriptListItem';

import { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';
import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import styles from './DefaultTranscriptsList.scss';

type Props = {
  gene: Gene;
  rulerTicks: TicksAndScale;
};

const compareTranscriptLength = (
  transcriptOne: Transcript,
  transcriptTwo: Transcript
) => {
  const transcriptOneLength = getFeatureLength(transcriptOne);
  const transcriptTwoLength = getFeatureLength(transcriptTwo);

  if (transcriptOneLength < transcriptTwoLength) {
    return -1;
  }

  if (transcriptOneLength > transcriptTwoLength) {
    return 1;
  }

  return 0;
};

const sortTranscripts = (transcripts: Transcript[]) => {
  const transcriptsWithCds = transcripts
    .filter((transcript) => transcript.cds)
    .sort(compareTranscriptLength);

  const transcriptsWithoutCds = transcripts.filter(
    (transcript) => !transcript.cds
  );

  const proteinCodingTranscripts = transcriptsWithoutCds
    .filter((transcript) => transcript.biotype === 'protein_coding')
    .sort(compareTranscriptLength);

  const nonProteinCodingTranscripts = sortBy(
    transcriptsWithoutCds.filter(
      (transcript) => transcript.biotype !== 'protein_coding'
    ),
    ['biotype']
  );

  return [
    ...transcriptsWithCds,
    ...proteinCodingTranscripts,
    ...nonProteinCodingTranscripts
  ];
};

const DefaultTranscriptslist = (props: Props) => {
  const { gene } = props;
  const sortedTranscripts = sortTranscripts(gene.transcripts);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.row}>
          <div className={styles.left}>Filter & sort</div>
          <div className={styles.middle}></div>
          <div className={styles.right}>Transcript ID</div>
        </div>
      </div>
      <div className={styles.content}>
        {sortedTranscripts.map((transcript, index) => (
          <DefaultTranscriptsListItem
            key={index}
            gene={gene}
            transcript={transcript}
            rulerTicks={props.rulerTicks}
          />
        ))}
        <StripedBackground {...props} />
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

export default DefaultTranscriptslist;
