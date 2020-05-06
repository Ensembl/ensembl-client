import React from 'react';
import classNames from 'classnames';

import ProteinDomainImage from '../../protein-domain-image/ProteinDomainImage';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import transcriptsListStyles from 'src/content/app/entity-viewer/gene-view/components/default-transcripts-list/DefaultTranscriptsList.scss';
import styles from './ProteinsListItemInfo.scss';

type Props = {
  transcript: Transcript;
};

const ProteinsListItemInfo = (props: Props) => {
  const proteinId = props.transcript.cds?.protein?.id as string;

  const mainStyles = classNames(
    transcriptsListStyles.row,
    styles.proteinsListItemInfo
  );

  return (
    <div className={mainStyles}>
      <ProteinDomainImage proteinId={proteinId} width={1000} />
    </div>
  );
};

export default ProteinsListItemInfo;
