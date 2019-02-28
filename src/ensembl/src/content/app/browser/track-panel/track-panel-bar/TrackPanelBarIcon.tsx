import React, { FunctionComponent, memo, useState, useCallback } from 'react';
import { TrackPanelBarItem } from './trackPanelBarConfig';

import styles from './TrackPanelBarIcon.scss';

type TrackPanelBarIconProps = {
  closeTrackPanelModal: () => void;
  iconConfig: TrackPanelBarItem;
  openTrackPanelModal: (trackPanelModalView: string) => void;
  trackPanelModalView: string;
};

const TrackPanelBarIcon: FunctionComponent<TrackPanelBarIconProps> = memo(
  (props: TrackPanelBarIconProps) => {
    const [toggleState, setToggleState] = useState(false);

    const toggleModalView = useCallback(() => {
      const newToggleState: boolean = !toggleState;

      if (newToggleState === true) {
        props.openTrackPanelModal(props.iconConfig.name);
      } else {
        props.closeTrackPanelModal();
      }

      setToggleState(newToggleState);
    }, [props.iconConfig.name, toggleState]);

    const getViewIcon = () => {
      const { iconConfig, trackPanelModalView } = props;

      return iconConfig.name === trackPanelModalView
        ? iconConfig.icon.selected
        : iconConfig.icon.default;
    };

    return (
      <dt className={styles.barIcon}>
        <button onClick={toggleModalView}>
          <img src={getViewIcon()} alt={props.iconConfig.description} />
        </button>
      </dt>
    );
  }
);

export default TrackPanelBarIcon;
