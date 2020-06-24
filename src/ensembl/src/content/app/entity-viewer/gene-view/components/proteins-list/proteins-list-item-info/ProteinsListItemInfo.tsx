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

import React from 'react';

import ProteinDomainImage from 'src/content/app/entity-viewer/gene-view/components/protein-domain-image/ProteinDomainImage';
import CollapsedExonsImage from 'src/content/app/entity-viewer/gene-view/components/collapsed-exons-image/CollapsedExonsImage';

import { getNumberOfCodingExons } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import styles from './ProteinsListItemInfo.scss';

type Props = {
  transcript: Transcript;
  refCDSLength: number;
};

const ProteinsListItemInfo = (props: Props) => {
  const { transcript, refCDSLength } = props;

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
      </div>
      {transcript.cds && (
        <CollapsedExonsImage
          transcriptId={transcript.id}
          refCDSLength={refCDSLength}
          width={695}
        />
      )}
    </div>
  );
};

export default ProteinsListItemInfo;
