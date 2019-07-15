import React, { FunctionComponent } from 'react';
import get from 'lodash/get';
import find from 'lodash/find';

import { EnsObject } from 'src/ens-object/ensObjectTypes';

import styles from '../Drawer.scss';

type DrawerTranscriptProps = {
  ensObject: EnsObject;
};

const TRANSCRIPT_GENE_NAME = 'gene-feat-1';

const DrawerTranscript: FunctionComponent<DrawerTranscriptProps> = (
  props: DrawerTranscriptProps
) => {
  const { ensObject } = props;

  if (!ensObject.track) {
    return null;
  }

  // FIXME: this is a temporary function; need to come up with something more robust
  const getTranscriptTrack = () => {
    const childTracks = get(ensObject, 'track.child_tracks', []);

    return find(childTracks, { track_id: TRANSCRIPT_GENE_NAME }) || null;
  };

  const transcriptTrack = getTranscriptTrack();

  if (!transcriptTrack) {
    return null;
  }

  return (
    <dl className={styles.drawerView}>
      <dd className="clearfix">
        <label htmlFor="">Transcript</label>
        <div className={styles.details}>
          <p>
            <span className={styles.mainDetail}>{ensObject.stable_id}</span>
            <span className={styles.secondaryDetail}>
              {transcriptTrack.additional_info}
            </span>
          </p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Gene</label>
        <div className={styles.details}>
          <p>
            <span>{ensObject.label}</span>
            <span className={styles.secondaryDetail}>
              {ensObject.stable_id}
            </span>
          </p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Description</label>
        <div className={styles.details}>
          {transcriptTrack.description || '--'}
        </div>
      </dd>
    </dl>
  );
};

export default DrawerTranscript;
