/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    <>
      <div className={transcriptsListStyles.row}>
        <div className={transcriptsListStyles.left}>UniProt P51587</div>
        <div onClick={toggleListItemInfo} className={midStyles}>
          <div>Protein description from UniProt</div>
          <div>{props.transcript.cds?.protein_length} aa</div>
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
    </>
  );
};

export default ProteinsListItem;
