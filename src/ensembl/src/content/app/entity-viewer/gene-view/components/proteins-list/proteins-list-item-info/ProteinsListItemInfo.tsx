import React from 'react';

import ProteinDomainImage from 'src/content/app/entity-viewer/gene-view/components/protein-domain-image/ProteinDomainImage';

import { getNumberOfCodingExons } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import styles from './ProteinsListItemInfo.scss';

type Props = {
  transcript: Transcript;
};

const ProteinsListItemInfo = (props: Props) => {
  const { transcript } = props;

  return (
    <div className={styles.proteinsListItemInfo}>
      {transcript.cds && (
        <ProteinDomainImage transcriptId={transcript.id} width={695} />
      )}
      <div className={styles.bottomWrapper}>
        <div className={styles.codingExonCount}>
          Coding exons <strong>{getNumberOfCodingExons(transcript)}</strong> of{' '}
          {transcript.exons.length}
        </div>
        <div className={styles.sequenceDownload}>
          Sequence download component
        </div>
      </div>
    </div>
  );
};

export default ProteinsListItemInfo;
