import React, { FunctionComponent } from 'react';

import { EnsObject, EnsObjectTrack } from 'src/ens-object/ensObjectTypes';

import styles from '../Drawer.scss';

type DrawerTranscriptProps = {
  ensObjectInfo: EnsObject;
  ensObjectTrack: EnsObjectTrack | undefined;
};

const DrawerTranscript: FunctionComponent<DrawerTranscriptProps> = (
  props: DrawerTranscriptProps
) => {
  const { ensObjectInfo, ensObjectTrack } = props;

  if (!ensObjectTrack) {
    return null;
  }
  const transcriptStableId = ensObjectInfo.stable_id;
  const additionalInfo = ensObjectTrack.additional_info;
  const geneSymbol = ensObjectInfo.label;
  const geneStableId = ensObjectInfo.stable_id;

  return (
    <dl className={styles.drawerView}>
      <dd className="clearfix">
        <label htmlFor="">Transcript</label>
        <div className={styles.details}>
          <p>
            <span className={styles.mainDetail}>{transcriptStableId}</span>
            <span className={styles.secondaryDetail}>{additionalInfo}</span>
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
          {additionalInfo === 'MANE Select' ? (
            <>
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
            </>
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
