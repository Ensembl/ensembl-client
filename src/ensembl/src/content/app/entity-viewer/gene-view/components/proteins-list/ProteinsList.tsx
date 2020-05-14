import React, { useEffect, useState } from 'react';

import ProteinsListItem from './proteins-list-item/ProteinsListItem';

import { fetchGene } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/geneData';

import { Gene } from 'src/content/app/entity-viewer/types/gene';

import styles from './ProteinsList.scss';

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

  return (
    <div className={styles.proteinsList}>
      {proteinCodingTranscripts.map((transcript) => (
        <ProteinsListItem key={transcript.id} transcript={transcript} />
      ))}
    </div>
  );
};

export default ProteinsList;
