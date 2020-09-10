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
import { connect } from 'react-redux';
import { useLocation } from 'react-router';

import { useRestoreScrollPosition } from 'src/shared/hooks/useRestoreScrollPosition';
import { CircleLoader } from 'src/shared/components/loader/Loader';
import ProteinsListItem from './proteins-list-item/ProteinsListItem';

import { fetchGene } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/geneData';
import { getLongestProteinLength } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import { defaultSort } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';

import { toggleExpandedProtein } from 'src/content/app/entity-viewer/state/gene-view/proteins/geneViewProteinsSlice';
import { getExpandedTranscriptIds } from 'src/content/app/entity-viewer/state/gene-view/proteins/geneViewProteinsSelectors';

import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { RootState } from 'src/store';

import styles from './ProteinsList.scss';

const COMPONENT_ID = 'entity_viewer_gene_view_protein_list';

type ProteinsListProps = {
  geneId: string;
  expandedTranscriptIds: string[];
  toggleExpandedProtein: (id: string) => void;
};

type ProteinsListWithDataProps = {
  gene: Gene;
  expandedTranscriptIds: string[];
  toggleExpandedProtein: (id: string) => void;
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

  return geneData ? (
    <ProteinsListWithData
      gene={geneData}
      expandedTranscriptIds={props.expandedTranscriptIds}
      toggleExpandedProtein={props.toggleExpandedProtein}
    />
  ) : (
    <div className={styles.proteinsListLoadingContainer}>
      <CircleLoader />
    </div>
  );
};

const ProteinsListWithData = (props: ProteinsListWithDataProps) => {
  const uniqueScrollReferenceId = COMPONENT_ID + props.gene.id;

  const { search } = useLocation();
  const transcriptIdToFocus = new URLSearchParams(search).get('transcriptId');

  const { targetElementRef } = useRestoreScrollPosition({
    referenceId: uniqueScrollReferenceId
  });

  const sortedTranscripts = defaultSort(props.gene.transcripts);
  const proteinCodingTranscripts = sortedTranscripts.filter(
    (transcript) => !!transcript.cds
  );

  useEffect(() => {
    const hasExpandedTranscripts = !!props.expandedTranscriptIds.length;

    // Expand the first transcript by default
    if (!hasExpandedTranscripts && !transcriptIdToFocus) {
      props.toggleExpandedProtein(sortedTranscripts[0].id);
    }
  }, []);

  const longestProteinLength = getLongestProteinLength(props.gene);

  return (
    <div className={styles.proteinsList} ref={targetElementRef}>
      {proteinCodingTranscripts.map((transcript) => (
        <ProteinsListItem
          key={transcript.id}
          transcript={transcript}
          trackLength={longestProteinLength}
        />
      ))}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  expandedTranscriptIds: getExpandedTranscriptIds(state)
});

const mapDispatchToProps = {
  toggleExpandedProtein
};

export default connect(mapStateToProps, mapDispatchToProps)(ProteinsList);
