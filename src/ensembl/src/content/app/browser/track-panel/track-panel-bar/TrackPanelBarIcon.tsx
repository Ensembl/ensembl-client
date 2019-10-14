import React, { useState, useEffect } from 'react';
import { TrackPanelBarItem } from './trackPanelBarConfig';
import ImageButton, {
  ImageButtonStatus
} from 'src/shared/components/image-button/ImageButton';

import styles from './TrackPanelBarIcon.scss';

export type TrackPanelBarIconProps = {
  closeTrackPanelModal: () => void;
  iconConfig: TrackPanelBarItem;
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  openTrackPanelModal: (trackPanelModalView: string) => void;
  trackPanelModalView: string;
  toggleTrackPanel: (isTrackPanelOpened: boolean) => void;
};

const TrackPanelBarIcon = (props: TrackPanelBarIconProps) => {
  const [isIconActive, setIconActive] = useState(false);

  useEffect(() => {
    if (!props.isTrackPanelModalOpened) {
      setIconActive(false);
    }
  }, [props.isTrackPanelModalOpened]);

  const toggleModalView = () => {
    let newIconActiveState = !isIconActive;

    if (!props.isTrackPanelOpened) {
      props.toggleTrackPanel(true);
      newIconActiveState = true;
    }

    if (newIconActiveState) {
      props.openTrackPanelModal(props.iconConfig.name);
    } else {
      props.closeTrackPanelModal();
    }

    setIconActive(newIconActiveState);
  };

  const getViewIconStatus = () => {
    const { iconConfig, trackPanelModalView } = props;

    return iconConfig.name === trackPanelModalView && props.isTrackPanelOpened
      ? ImageButtonStatus.HIGHLIGHTED
      : ImageButtonStatus.ACTIVE;
  };

  return (
    <dt className={styles.barIcon}>
      <ImageButton
        buttonStatus={getViewIconStatus()}
        description={props.iconConfig.description}
        onClick={toggleModalView}
        image={props.iconConfig.icon}
      />
    </dt>
  );
};

export default TrackPanelBarIcon;
