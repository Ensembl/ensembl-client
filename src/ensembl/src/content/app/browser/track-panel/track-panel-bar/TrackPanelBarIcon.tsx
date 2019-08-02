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
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  openTrackPanelModal: (trackPanelModalView: string) => void;
  trackPanelModalView: string;
};

const TrackPanelBarIcon: FunctionComponent<TrackPanelBarIconProps> = memo(
  (props: TrackPanelBarIconProps) => {
    const [toggleState, setToggleState] = useState(false);

    useEffect(() => {
      if (!props.isTrackPanelModalOpened) {
        setToggleState(false);
      }
    }, [props.isTrackPanelModalOpened]);

    const toggleModalView = useCallback(() => {
      if (!props.isTrackPanelOpened) {
        return;
      }

      const newToggleState = !toggleState;

      if (newToggleState) {
        props.openTrackPanelModal(props.iconConfig.name);
      } else {
        props.closeTrackPanelModal();
      }

      setToggleState(newToggleState);
    }, [props.iconConfig.name, props.isTrackPanelOpened, toggleState]);

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
