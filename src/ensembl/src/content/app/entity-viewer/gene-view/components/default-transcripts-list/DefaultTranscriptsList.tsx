import React from 'react';

import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import DefaultTranscriptsListItem from './default-transcripts-list-item/DefaultTranscriptListItem';

import { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';
import { Gene } from 'src/content/app/entity-viewer/types/gene';

import styles from './DefaultTranscriptsList.scss';

type Props = {
  gene: Gene;
  rulerTicks: TicksAndScale;
};

const DefaultTranscriptslist = (props: Props) => {
  const { gene } = props;

  return (
    <div className={styles.defaultTranscriptsList}>
      <div className={styles.header}>
        <div className={styles.row}>
          <div className={styles.left}>Filter &amp; sort</div>
          <div className={styles.middle}></div>
          <div className={styles.right}>Transcript ID</div>
        </div>
      </div>
      <div className={styles.content}>
        {gene.transcripts.map((transcript, index) => (
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
