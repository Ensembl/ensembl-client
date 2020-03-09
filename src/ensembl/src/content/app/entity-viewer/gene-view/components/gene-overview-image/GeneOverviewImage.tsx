import React from 'react';
import { scaleLinear } from 'd3';

import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import UnsplicedTranscript from 'src/content/app/entity-viewer/gene-view/components/unspliced-transcript/UnsplicedTranscript';
import BasePairsRuler from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';

import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { Strand } from 'src/content/app/entity-viewer/types/strand';
import { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';

import styles from './GeneOverviewImage.scss';

type GeneOverviewImageProps = {
  gene: Gene;
  onTicksCalculated: (payload: TicksAndScale) => void;
};

const GeneOverviewImage = (props: GeneOverviewImageProps) => {
  const { start: geneStart, end: geneEnd } = getFeatureCoordinates(props.gene); // FIXME: use gene length further on
  const length = geneEnd - geneStart;

  return (
    <div className={styles.container}>
      <GeneId {...props} />
      <DirectionIndicator />
      <GeneImage {...props} />
      <StrandIndicator {...props} />
      <NumberOfTranscripts {...props} />
      <div className={styles.ruler}>
        <BasePairsRuler
          length={length}
          width={695}
          onTicksCalculated={props.onTicksCalculated}
          standalone={true}
        />
      </div>
    </div>
  );
};

export const GeneImage = (props: GeneOverviewImageProps) => {
  const width = 695;
  const { start: geneStart, end: geneEnd } = getFeatureCoordinates(props.gene);

  // FIXME: use the "length" property of the gene when it is added to payload;
  // (it will help with drawing genes of circular chromosomes)
  const scale = scaleLinear()
    .domain([geneStart, geneEnd])
    .range([0, width]);

  const renderedTranscripts = props.gene.transcripts.map(
    (transcript, index) => {
      const {
        start: transcriptStart,
        end: transcriptEnd
      } = getFeatureCoordinates(transcript);
      const startX = scale(transcriptStart);
      const endX = scale(transcriptEnd);
      const y = 10;
      const width = Math.floor(endX - startX);
      return (
        <g key={index} transform={`translate(${startX} ${y})`}>
          <UnsplicedTranscript
            transcript={transcript}
            width={width}
            classNames={{
              transcript: styles.transcript
            }}
          />
        </g>
      );
    }
  );

  return (
    <svg className={styles.containerSVG} width={width}>
      {renderedTranscripts}
    </svg>
  );
};

const GeneId = (props: GeneOverviewImageProps) => (
  <div className={styles.geneId}>{props.gene.id}</div>
);

const DirectionIndicator = () => {
  return (
    <div className={styles.directionIndicator}>
      <span>5'</span>
      <span>3'</span>
    </div>
  );
};

// FIXME translating response into display name (forward strand, reverse strand) should be a shared function
const StrandIndicator = (props: GeneOverviewImageProps) => {
  const {
    gene: {
      slice: {
        region: {
          strand: { code: strandCode }
        }
      }
    }
  } = props;

  const strandDisplayName =
    strandCode === Strand.FORWARD ? 'forward strand' : 'reverse strand';

  return <div className={styles.strand}>{strandDisplayName}</div>;
};

const NumberOfTranscripts = (props: GeneOverviewImageProps) => {
  return (
    <div className={styles.numberOfTranscripts}>
      <span className={styles.transcriptsCount}>
        {props.gene.transcripts.length}
      </span>{' '}
      transcripts
    </div>
  );
};

export default GeneOverviewImage;
