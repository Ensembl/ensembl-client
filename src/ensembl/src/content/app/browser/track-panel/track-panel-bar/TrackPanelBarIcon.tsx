import React, {
  FunctionComponent,
  memo,
  useState,
  useCallback,
  useEffect
} from 'react';
import { TrackPanelBarItem } from './trackPanelBarConfig';
import ImageButton, {
  ImageButtonStatus
} from 'src/shared/image-button/ImageButton';
import styles from './TrackPanelBarIcon.scss';

type TrackPanelBarIconProps = {
  closeTrackPanelModal: () => void;
  iconConfig: TrackPanelBarItem;
  openTrackPanelModal: (trackPanelModalView: string) => void;
  trackPanelModalOpened: boolean;
  trackPanelModalView: string;
};

const TrackPanelBarIcon: FunctionComponent<TrackPanelBarIconProps> = memo(
  (props: TrackPanelBarIconProps) => {
    const [toggleState, setToggleState] = useState(false);

    useEffect(() => {
      if (props.trackPanelModalOpened === false) {
        setToggleState(false);
      }
    }, [props.trackPanelModalOpened]);

    const toggleModalView = useCallback(() => {
      const newToggleState: boolean = !toggleState;

      if (newToggleState === true) {
        props.openTrackPanelModal(props.iconConfig.name);
      } else {
        props.closeTrackPanelModal();
      }

      setToggleState(newToggleState);
    }, [props.iconConfig.name, toggleState]);

    const getViewIconStatus = () => {
      const { iconConfig, trackPanelModalView } = props;

      return iconConfig.name === trackPanelModalView
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
  }
);

export default TrackPanelBarIcon;
