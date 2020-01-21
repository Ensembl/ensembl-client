import React, { FunctionComponent } from 'react';
import get from 'lodash/get';
import find from 'lodash/find';

import { getDisplayStableId } from 'src/shared/state/ens-object/ensObjectHelpers';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

import styles from '../Drawer.scss';

type DrawerTranscriptProps = {
  ensObject: EnsObject;
};

// TODO: Once we start supporting multiple transcripts, we need to either remove this constant or move it to trackConfig
const TRANSCRIPT_GENE_NAME = 'track:gene-feat-1';

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

  // FIXME: this is a very horrible temporary function;
  // it will break when multiple transcripts are added
  // but by that time we'll have to do a major refactor for ensObject and ensObject tracks anyway
  const getTranscriptStableId = () => {
    return get(ensObject, 'track.child_tracks.0.label', '');
  };

  const transcriptTrack = getTranscriptTrack();

  if (!transcriptTrack) {
    return null;
  }

  return (
    <div className={styles.drawerView}>
      <div className={styles.container}>
        <div className={styles.label}>Transcript</div>
        <div className={styles.details}>
          <span className={styles.mainDetail}>{getTranscriptStableId()}</span>
          <span className={styles.secondaryDetail}>
            {transcriptTrack.additional_info}
          </span>
        </div>

        <div className={styles.label}>Gene</div>
        <div className={styles.details}>
          <span>{ensObject.label}</span>
          <span className={styles.secondaryDetail}>
            {getDisplayStableId(ensObject)}
          </span>
        </div>

        <div className={styles.label}>Description</div>
        <div className={styles.details}>
          {transcriptTrack.description || '--'}
        </div>
      </div>
    </div>
  );
};

export default DrawerTranscript;
