import React, { FunctionComponent } from 'react';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { RootState } from 'src/store';
import { Bookmark } from 'src/content/app/browser/track-panel/trackPanelState';
import { TrackStates } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { updateTrackStates } from 'src/content/app/browser/browserActions';
import { closeTrackPanelModal } from 'src/content/app/browser/track-panel/trackPanelActions';
import { getActiveGenomePreviouslyViewedObjects } from 'src/content/app/browser/track-panel/trackPanelSelectors';
import { closeDrawer } from 'src/content/app/browser/drawer/drawerActions';
import upperFirst from 'lodash/upperFirst';
import styles from './DrawerBookmarks.scss';

type StateProps = {
  previouslyViewedObjects: Bookmark[];
};

type DispatchProps = {
  updateTrackStates: (trackStates: TrackStates) => void;
  closeTrackPanelModal: () => void;
  closeDrawer: () => void;
};
export type DrawerBookmarksProps = StateProps & DispatchProps;

const DrawerBookmarks: FunctionComponent<DrawerBookmarksProps> = (
  props: DrawerBookmarksProps
) => {
  return (
    <>
      <div className={styles.drawerTitle}> All previously viewed</div>
      <div className={styles.contentWrapper}>
        <dl className={styles.linksWrapper}>
          {[...props.previouslyViewedObjects]
            .reverse()
            .map((previouslyViewedObject, index) => {
              const path = urlFor.browser({
                genomeId: previouslyViewedObject.genome_id,
                focus: previouslyViewedObject.object_id
              });

              const onClickHandler = () => {
                props.updateTrackStates({
                  [previouslyViewedObject.genome_id]: {
                    ...previouslyViewedObject.trackStates
                  }
                });

                props.closeTrackPanelModal();
                props.closeDrawer();
              };

              return (
                <dd key={index}>
                  <Link to={path} onClick={onClickHandler}>
                    {previouslyViewedObject.label}
                  </Link>
                  <span className={styles.previouslyViewedObjectType}>
                    {' '}
                    {upperFirst(previouslyViewedObject.object_type)}
                  </span>
                </dd>
              );
            })}
        </dl>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  previouslyViewedObjects: getActiveGenomePreviouslyViewedObjects(state)
});

const mapDispatchToProps = {
  updateTrackStates,
  closeTrackPanelModal,
  closeDrawer
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawerBookmarks);
