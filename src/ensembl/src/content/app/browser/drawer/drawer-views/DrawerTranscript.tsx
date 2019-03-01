import React, { FunctionComponent } from 'react';

import styles from '../Drawer.scss';

const DrawerTranscript: FunctionComponent = () => {
  return (
    <dl className={styles.drawerView}>
      <dd className="clearfix">
        <label htmlFor="">Transcript</label>
        <div className={styles.details}>
          <p>
            <span className={styles.mainDetail}>ENST00000380152.7</span>
            <span className={styles.secondaryInfo}>MANE Select</span>
          </p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Gene</label>
        <div className={styles.details}>
          <p>
            <span>BRCA2</span>
            <span className={styles.secondaryInfo}>ENSG00000139618</span>
          </p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Description</label>
        <div className={styles.details}>
          <p>
            MANE Select transcripts match GRCh38 and are 100% identical between
            Ensembl-GENCODE and RefSeq for 5' UTR, CDS, splicing and 3' UTR.
          </p>
          <p>
            The MANE project (Matched Annotation from NCBI and EMBL-EBI) is
            collaboration betwen Ensembl-GENCODE and RefSeq to select a default
            transcript per human protein coding locus that is representative of
            biology, and is well-supported, expressed and conserved.
          </p>
        </div>
      </dd>
    </dl>
  );
};

export default DrawerTranscript;
