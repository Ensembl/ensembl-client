import React from 'react';

import ExternalLink from 'src/content/app/entity-viewer/gene-view/components/external-link/ExternalLink';

import styles from './Overview.scss';

const Overview = () => {
  return (
    <div>
      <div className={styles.geneSymbol}>BRCA2</div>
      <div className={styles.stableId}>ENSG00000139618.15</div>

      <div className={styles.titleWithSeparator}>Example links</div>

      <div className={styles.geneName}>
        <ExternalLink
          label={'BRCA2, DNA repair associated'}
          linkText={'HGNC:1101'}
          linkUrl={'https://www.uniprot.org/uniprot/H0YE37'}
        />
      </div>
    </div>
  );
};

export default Overview;
