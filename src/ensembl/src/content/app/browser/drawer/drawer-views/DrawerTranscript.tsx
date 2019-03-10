import React, { FunctionComponent, Fragment } from 'react';

import styles from '../Drawer.scss';

type DrawerTranscriptProps = {
  objectInfo: any;
};

const DrawerTranscript: FunctionComponent<DrawerTranscriptProps> = (
  props: DrawerTranscriptProps
) => {
  const { objectInfo } = props;

  let transcriptStableId = objectInfo.associated_object.stable_id;
  let selectedInfo = objectInfo.associated_object.selected_info;
  let geneSymbol = objectInfo.obj_symbol;
  let geneStableId = objectInfo.stable_id;

  if (objectInfo.obj_type === 'transcript') {
    transcriptStableId = objectInfo.stable_id;
    selectedInfo = objectInfo.selected_info;
    geneSymbol = objectInfo.associated_object.obj_symbol;
    geneStableId = objectInfo.associated_object.stable_id;
  }

  return (
    <dl className={styles.drawerView}>
      <dd className="clearfix">
        <label htmlFor="">Transcript</label>
        <div className={styles.details}>
          <p>
            <span className={styles.mainDetail}>{transcriptStableId}</span>
            <span className={styles.secondaryDetail}>{selectedInfo}</span>
          </p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Gene</label>
        <div className={styles.details}>
          <p>
            <span>{geneSymbol}</span>
            <span className={styles.secondaryDetail}>{geneStableId}</span>
          </p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Description</label>
        <div className={styles.details}>
          {selectedInfo === 'MANE Select' ? (
            <Fragment>
              <p>
                MANE Select transcripts match GRCh38 and are 100% identical
                between Ensembl-GENCODE and RefSeq for 5' UTR, CDS, splicing and
                3' UTR.
              </p>
              <p>
                The MANE project (Matched Annotation from NCBI and EMBL-EBI) is
                collaboration betwen Ensembl-GENCODE and RefSeq to select a
                default transcript per human protein coding locus that is
                representative of biology, and is well-supported, expressed and
                conserved.
              </p>
            </Fragment>
          ) : (
            <p>
              The Selected transcript is defined as either the longest CDS (if
              the gene has translated transcripts) or the longest cDNA
            </p>
          )}
        </div>
      </dd>
    </dl>
  );
};

export default DrawerTranscript;
