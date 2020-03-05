import React from 'react';

import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import DefaultTranscriptslistItem from './default-transcripts-list-item/DefaultTranscriptListItem';

import { OnTicksCalculatedPayload } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';
import { Gene } from 'src/content/app/entity-viewer/types/gene';

import styles from './DefaultTranscriptsList.scss';

type Props = {
  gene: Gene;
  rulerTicks: OnTicksCalculatedPayload;
};

const DefaultTranscriptslist = (props: Props) => {
  const { gene } = props;

  return (
    <div className={styles.defaultTranscriptsList}>
      {gene.transcripts.map((transcript, index) => (
        <DefaultTranscriptslistItem
          key={index}
          gene={gene}
          transcript={transcript}
          rulerTicks={props.rulerTicks}
        />
      ))}
      <StripedBackground {...props} />
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
