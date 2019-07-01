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

  return (
    <dl className={styles.drawerView}>
      <dd className="clearfix">
        <label htmlFor="">Transcript</label>
        <div className={styles.details}>
          <p>
            <span className={styles.mainDetail}>{ensObjectInfo.stable_id}</span>
            <span className={styles.secondaryDetail}>
              {ensObjectTrack.additional_info}
            </span>
          </p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Gene</label>
        <div className={styles.details}>
          <p>
            <span>{ensObjectInfo.label}</span>
            <span className={styles.secondaryDetail}>
              {ensObjectInfo.stable_id}
            </span>
          </p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Description</label>
        <div className={styles.details}>
          {ensObjectTrack.description || '--'}
        </div>
      </dd>
    </dl>
  );
};

export default DrawerTranscript;
