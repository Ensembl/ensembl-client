import React, { FunctionComponent, useCallback } from 'react';
import { connect } from 'react-redux';

import { trackPanelBarConfig, TrackPanelBarItem } from './trackPanelBarConfig';
import { getBrowserActiveGenomeId } from '../../browserSelectors';
import { getIsDrawerOpened } from '../../drawer/drawerSelectors';
import {
  getIsTrackPanelModalOpened,
  getIsTrackPanelOpened,
  getTrackPanelModalView
} from '../trackPanelSelectors';
import { RootState } from 'src/store';
import { getLaunchbarExpanded } from 'src/header/headerSelectors';
import {
  toggleTrackPanel,
  closeTrackPanelModal,
  openTrackPanelModal
} from '../trackPanelActions';
import { closeDrawer } from '../../drawer/drawerActions';

import TrackPanelBarIcon from './TrackPanelBarIcon';

import chevronLeftIcon from 'static/img/shared/chevron-left.svg';
import chevronRightIcon from 'static/img/shared/chevron-right.svg';

import styles from './TrackPanelBar.scss';

type StateProps = {
  activeGenomeId: string | null;
  isDrawerOpened: boolean;
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  launchbarExpanded: boolean;
  trackPanelModalView: string;
};

type DispatchProps = {
  closeDrawer: () => void;
  closeTrackPanelModal: () => void;
  openTrackPanelModal: (trackPanelModalView: string) => void;
  toggleTrackPanel: (isTrackPanelOpened?: boolean) => void;
};

type OwnProps = {};

type TrackPanelBarProps = StateProps & DispatchProps & OwnProps;

const TrackPanelBar: FunctionComponent<TrackPanelBarProps> = (
  props: TrackPanelBarProps
) => {
  const moveTrackPanel = useCallback(() => {
    if (props.isDrawerOpened) {
      props.closeDrawer();
    } else {
      props.toggleTrackPanel(!props.isTrackPanelOpened);
    }
  }, [
    props.isDrawerOpened,
    props.closeDrawer,
    props.toggleTrackPanel,
    props.isTrackPanelOpened
  ]);

  const getClassNames = () => {
    const heightClass: string = props.launchbarExpanded
      ? styles.shorter
      : styles.taller;

    return `${styles.trackPanelBar} ${heightClass}`;
  };

  return (
    <div className={getClassNames()}>
      <dl>
        <dt className={styles.sliderButton}>
          <button onClick={moveTrackPanel}>
            {props.isTrackPanelOpened ? (
              <img src={chevronRightIcon} alt="collapse" />
            ) : (
              <img src={chevronLeftIcon} alt="expand" />
            )}
          </button>
        </dt>
        {trackPanelBarConfig.map((item: TrackPanelBarItem) => (
          <TrackPanelBarIcon
            key={item.name}
            iconConfig={item}
            closeTrackPanelModal={props.closeTrackPanelModal}
            openTrackPanelModal={props.openTrackPanelModal}
            isTrackPanelModalOpened={props.isTrackPanelModalOpened}
            isTrackPanelOpened={props.isTrackPanelOpened}
            trackPanelModalView={props.trackPanelModalView}
          />
        ))}
      </dl>
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  isDrawerOpened: getIsDrawerOpened(state),
  isTrackPanelModalOpened: getIsTrackPanelModalOpened(state),
  isTrackPanelOpened: getIsTrackPanelOpened(state),
  launchbarExpanded: getLaunchbarExpanded(state),
  trackPanelModalView: getTrackPanelModalView(state)
});

const mapDispatchToProps: DispatchProps = {
  closeDrawer,
  closeTrackPanelModal,
  openTrackPanelModal,
  toggleTrackPanel
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanelBar);
