import React, { useEffect, useState } from 'react';

import ProteinsListItem from './proteins-list-item/ProteinsListItem';

import { fetchGene } from '../../../shared/rest/rest-data-fetchers/geneData';

import { Gene } from '../../../types/gene';

import styles from './ProteinsList.scss';

type ProteinsListProps = {
  geneId: string;
};

type ProteinListWithDataProps = {
  gene: Gene | null;
};

const ProteinsList = (props: ProteinsListProps) => {
  const [geneData, setGeneData] = useState<Gene | null>(null);

  useEffect(() => {
    fetchGene(props.geneId).then((result) => {
      if (result) {
        setGeneData(result);
      }
    });
  }, [props.geneId]);

  return <ProteinListWithData gene={geneData} />;
};

const ProteinListWithData = (props: ProteinListWithDataProps) => {
  if (!props.gene) {
    return null;
  }

  const transcriptsWithProtein = props.gene.transcripts.filter(
    (transcript) => !!transcript.cds
  );

  return (
    <div className={styles.proteinsList}>
      {transcriptsWithProtein.map((transcript) => (
        <ProteinsListItem key={transcript.id} transcript={transcript} />
      ))}
    </div>
  );
};

export default ProteinsList;
