import React, { useState } from 'react';
import classNames from 'classnames';

import ProteinsListItemInfo from '../proteins-list-item-info/ProteinsListItemInfo';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';
import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import transcriptsListStyles from 'src/content/app/entity-viewer/gene-view/components/default-transcripts-list/DefaultTranscriptsList.scss';
import styles from './ProteinsListItem.scss';

type Props = {
  transcript: Transcript;
};

const ProteinsListItem = (props: Props) => {
  const { transcript } = props;

  const [shouldShowInfo, setShouldShowInfo] = useState(false);
  const toggleListItemInfo = () => setShouldShowInfo(!shouldShowInfo);
  const getSplicedRNALength = () => {
    const rnaLength = transcript.exons.reduce((length, exon) => {
      const { start, end } = getFeatureCoordinates(exon);
      return length + (end - start + 1);
    }, 0);

    return getCommaSeparatedNumber(rnaLength);
  };

  const midStyles = classNames(transcriptsListStyles.middle, styles.middle);

  return (
    <div className={styles.proteinsListItem}>
      <div className={transcriptsListStyles.row}>
        <div className={transcriptsListStyles.left}>UniProt</div>
        <div onClick={toggleListItemInfo} className={midStyles}>
          <div>Protein description from UniProt</div>
          <div>{props.transcript.cds?.protein?.length} aa</div>
          <div className={styles.splicedLength}>
            Spliced RNA length <strong>{getSplicedRNALength()}</strong> bp
          </div>
        </div>
        <div
          className={transcriptsListStyles.right}
          onClick={toggleListItemInfo}
        >
          <span className={styles.transcriptId}>{props.transcript.id}</span>
        </div>
      </div>
      {shouldShowInfo ? (
        <ProteinsListItemInfo transcript={props.transcript} />
      ) : null}
    </div>
  );
};

export default ProteinsListItem;
