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

import React, { useEffect, useState } from 'react';

import ProteinsListItem from './proteins-list-item/ProteinsListItem';

import { fetchGene } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/geneData';

import { Gene } from 'src/content/app/entity-viewer/types/gene';

import styles from './ProteinsList.scss';
import { getRefSplicedRNALength } from '../../../shared/helpers/entity-helpers';

type ProteinsListProps = {
  geneId: string;
};

type ProteinsListWithDataProps = {
  gene: Gene;
};

const ProteinsList = (props: ProteinsListProps) => {
  const [geneData, setGeneData] = useState<Gene | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    fetchGene(props.geneId, abortController.signal).then((result) => {
      if (result) {
        setGeneData(result);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [props.geneId]);

  return geneData ? <ProteinsListWithData gene={geneData} /> : null;
};

const ProteinsListWithData = (props: ProteinsListWithDataProps) => {
  const proteinCodingTranscripts = props.gene.transcripts.filter(
    (transcript) => !!transcript.cds
  );

  const refSplicedRNALength = getRefSplicedRNALength(props.gene);

  return (
    <div className={styles.proteinsList}>
      {proteinCodingTranscripts.map((transcript) => (
        <ProteinsListItem
          key={transcript.id}
          transcript={transcript}
          refSplicedRNALength={refSplicedRNALength}
        />
      ))}
    </div>
  );
};

export default ProteinsList;
