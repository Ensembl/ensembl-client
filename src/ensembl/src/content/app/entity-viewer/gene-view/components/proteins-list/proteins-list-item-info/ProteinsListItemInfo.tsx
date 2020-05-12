import React from 'react';

import ProteinDomainImage from 'src/content/app/entity-viewer/gene-view/components/protein-domain-image/ProteinDomainImage';

import { getNumberOfCodingExons } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import styles from './ProteinsListItemInfo.scss';

type Props = {
  transcript: Transcript;
};

const ProteinsListItemInfo = (props: Props) => {
  const proteinId = props.transcript.cds?.protein?.id as string;

  return (
    <div className={styles.proteinsListItemInfo}>
      <ProteinDomainImage proteinId={proteinId} width={695} />

      <div className={styles.bottomWrapper}>
        <div className={styles.codingExonCount}>
          Coding exons <strong>{getNumberOfCodingExons(props.transcript)}</strong> of 27
        </div>
        <div className={styles.sequenceDownload}>
          Sequence download component
        </div>
      </div>
    </div>
  );
};

export default ProteinsListItemInfo;
