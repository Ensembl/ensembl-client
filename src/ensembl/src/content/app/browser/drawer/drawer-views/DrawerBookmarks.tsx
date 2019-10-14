import React from 'react';
import upperFirst from 'lodash/upperFirst';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { RootState } from 'src/store';
import { PreviouslyViewedObject } from 'src/content/app/browser/track-panel/trackPanelState';
import { BrowserTrackStates } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { updateTrackStatesAndSave } from 'src/content/app/browser/browserActions';
import { closeTrackPanelModal } from 'src/content/app/browser/track-panel/trackPanelActions';
import { closeDrawer } from 'src/content/app/browser/drawer/drawerActions';
import { getActiveGenomePreviouslyViewedObjects } from 'src/content/app/browser/track-panel/trackPanelSelectors';

import styles from './DrawerBookmarks.scss';

type StateProps = {
  previouslyViewedObjects: PreviouslyViewedObject[];
};

type DispatchProps = {
  updateTrackStatesAndSave: (trackStates: BrowserTrackStates) => void;
  closeTrackPanelModal: () => void;
  closeDrawer: () => void;
};
export type DrawerBookmarksProps = StateProps & DispatchProps;

const DrawerBookmarks = (props: DrawerBookmarksProps) => {
  const limitedPreviouslyViewedObjects = props.previouslyViewedObjects.slice(
    0,
    props.previouslyViewedObjects.length - 0
  );

  const onClickHandler = () => {
    props.closeTrackPanelModal();
    props.closeDrawer();
  };

  return (
    <>
      <div className={styles.drawerTitle}> All previously viewed</div>
      <div className={styles.contentWrapper}>
        <div className={styles.linksWrapper}>
          {[...limitedPreviouslyViewedObjects]
            .reverse()
            .map((previouslyViewedObject, index) => {
              const path = urlFor.browser({
                genomeId: previouslyViewedObject.genome_id,
                focus: previouslyViewedObject.object_id
              });

              return (
                <span key={index} className={styles.linkHolder}>
                  <Link to={path} onClick={onClickHandler}>
                    {previouslyViewedObject.label}
                  </Link>
                  <span className={styles.previouslyViewedType}>
                    {upperFirst(previouslyViewedObject.object_type)}
                  </span>
                </span>
              );
            })}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  previouslyViewedObjects: getActiveGenomePreviouslyViewedObjects(state)
});

const mapDispatchToProps = {
  updateTrackStatesAndSave,
  closeTrackPanelModal,
  closeDrawer
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawerBookmarks);
