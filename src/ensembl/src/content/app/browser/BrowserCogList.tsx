import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';
import BrowserCog from './BrowserCog';
import {
  updateCogList,
  updateCogTrackList,
  updateSelectedCog
} from './browserActions';
import { RootState } from 'src/store';
import { CogList } from './browserState';
import {
  getBrowserActivated,
  getBrowserCogList,
  getBrowserCogTrackList,
  getBrowserSelectedCog
} from './browserSelectors';

import styles from './BrowserCogList.scss';

type StateProps = {
  browserActivated: boolean;
  browserCogList: number;
  browserCogTrackList: CogList;
  selectedCog: any;
};

type DispatchProps = {
  updateCogList: (cogList: number) => void;
  updateCogTrackList: (track_y: CogList) => void;
  updateSelectedCog: (index: string) => void;
};

type OwnProps = {};

type BrowserCogListProps = StateProps & DispatchProps & OwnProps;

type BpaneScrollPayload = {
  delta_y?: number;
  track_y?: CogList;
};

const BrowserCogList: FunctionComponent<BrowserCogListProps> = (
  props: BrowserCogListProps
) => {
  const { browserCogTrackList } = props;
  const listenBpaneScroll = (payload: BpaneScrollPayload) => {
    const { delta_y, track_y } = payload;
    if (typeof delta_y === 'number') {
      props.updateCogList(delta_y);
    }
    if (track_y) {
      props.updateCogTrackList(track_y);
    }
  };

  useEffect(() => {
    const subscription = browserMessagingService.subscribe(
      'bpane-scroll',
      listenBpaneScroll
    );

    return () => subscription.unsubscribe();
  }, []);

  const cogs = Object.entries(browserCogTrackList).map(([name, pos]) => {
    const posStyle = { top: pos + 'px' };

    return (
      <div key={name} className={styles.browserCogOuter} style={posStyle}>
        <BrowserCog
          cogActivated={props.selectedCog === name}
          index={name}
          updateSelectedCog={props.updateSelectedCog}
        />
      </div>
    );
  });

  const transformStyle = {
    transform: 'translate(0,' + props.browserCogList + 'px)'
  };

  return props.browserActivated ? (
    <div className={styles.browserTrackConfigOuter}>
      <div className={styles.browserCogListOuter}>
        <div className={styles.browserCogListInner} style={transformStyle}>
          {cogs}
        </div>
      </div>
    </div>
  ) : null;
};

const mapStateToProps = (state: RootState): StateProps => ({
  browserActivated: getBrowserActivated(state),
  browserCogList: getBrowserCogList(state),
  browserCogTrackList: getBrowserCogTrackList(state),
  selectedCog: getBrowserSelectedCog(state)
});

const mapDispatchToProps: DispatchProps = {
  updateCogList,
  updateCogTrackList,
  updateSelectedCog
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserCogList);
