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

import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import { useGeneInfoQuery } from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';

import GeneName from 'src/shared/components/gene-name/GeneName';

import styles from './SequenceViewerTopBar.module.css';

const GeneTopBar = () => {
  const { parsedFocusObjectId, genomeId } = useSequenceViewerIds();
  const { currentData } = useGeneInfoQuery(
    {
      genomeId: genomeId ?? '',
      stableId: parsedFocusObjectId?.objectId ?? ''
    },
    {
      skip: !genomeId || !parsedFocusObjectId
    }
  );

  if (!currentData) {
    return null;
  }

  const { gene } = currentData;

  return (
    <div className={styles.focusWrapper}>
      <div className={styles.labelGroup}>
        <span className={styles.label}>Gene</span>
        <GeneName symbol={gene.symbol} stable_id={gene.stable_id} />
      </div>

      <div className={styles.labelGroup}>
        <span className={styles.label}>Biotype</span>
        <span>{gene.biotype}</span>
      </div>

      <div>
        <span>
          {gene.strand}
          {' strand'}
        </span>
      </div>

      <div>
        <span>
          {getFormattedLocation({
            chromosome: gene.region_name,
            start: gene.start,
            end: gene.end
          })}
        </span>
      </div>
    </div>
  );
};

export default GeneTopBar;
