import React, { FunctionComponent, memo } from 'react';
import { TrackPanelBarItem } from './trackPanelBarConfig';

import styles from './TrackPanelBarIcon.scss';

type TrackPanelBarIconProps = {
  iconConfig: TrackPanelBarItem;
};

const TrackPanelBarIcon: FunctionComponent<TrackPanelBarIconProps> = memo(
  (props: TrackPanelBarIconProps) => (
    <dt className={styles.barIcon}>
      <button>
        <img
          src={props.iconConfig.icon.default}
          alt={props.iconConfig.description}
        />
      </button>
    </dt>
  )
);

export default TrackPanelBarIcon;
