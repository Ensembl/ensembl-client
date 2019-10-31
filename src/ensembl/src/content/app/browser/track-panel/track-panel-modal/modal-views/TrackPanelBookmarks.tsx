import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import upperFirst from 'lodash/upperFirst';

import { RootState } from 'src/store';
import { EnsObject } from 'src/ens-object/ensObjectTypes';
import { getBrowserActiveGenomeId } from '../../../browserSelectors';
import { updateTrackStatesAndSave } from 'src/content/app/browser/browserActions';
import { BrowserTrackStates } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { getActiveGenomePreviouslyViewedObjects } from 'src/content/app/browser/track-panel/trackPanelSelectors';
import { fetchExampleEnsObjects } from 'src/ens-object/ensObjectActions';
import { getExampleEnsObjects } from 'src/ens-object/ensObjectSelectors';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { closeTrackPanelModal } from '../../trackPanelActions';
import ImageButton from 'src/shared/components/image-button/ImageButton';
import { ReactComponent as EllipsisIcon } from 'static/img/track-panel/ellipsis.svg';
import { changeDrawerViewAndOpen } from 'src/content/app/browser/drawer/drawerActions';
import { PreviouslyViewedObject } from 'src/content/app/browser/track-panel/trackPanelState';

import styles from './TrackPanelBookmarks.scss';
import { Status } from 'src/shared/types/status';

export type TrackPanelBookmarksProps = {
  activeGenomeId: string | null;
  exampleEnsObjects: EnsObject[];
  previouslyViewedObjects: PreviouslyViewedObject[];
  fetchExampleEnsObjects: (objectId: string) => void;
  updateTrackStatesAndSave: (trackStates: BrowserTrackStates) => void;
  closeTrackPanelModal: () => void;
  changeDrawerViewAndOpen: (drawerView: string) => void;
};

type ExampleLinksProps = Pick<
  TrackPanelBookmarksProps,
  'exampleEnsObjects' | 'activeGenomeId' | 'closeTrackPanelModal'
>;
export const ExampleLinks = (props: ExampleLinksProps) => {
  return (
    <div>
      {props.exampleEnsObjects.map((exampleObject) => {
        const path = urlFor.browser({
          genomeId: props.activeGenomeId,
          focus: exampleObject.object_id
        });

        return (
          <div key={exampleObject.object_id} className={styles.linkHolder}>
            <Link to={path} onClick={props.closeTrackPanelModal}>
              {exampleObject.label}
            </Link>
            <span className={styles.previouslyViewedType}>
              {upperFirst(exampleObject.object_type)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

type PreviouslyViewedLinksProps = Pick<
  TrackPanelBookmarksProps,
  | 'previouslyViewedObjects'
  | 'updateTrackStatesAndSave'
  | 'closeTrackPanelModal'
>;

export const PreviouslyViewedLinks = (props: PreviouslyViewedLinksProps) => {
  return (
    <div>
      {[...props.previouslyViewedObjects]
        .reverse()
        .map((previouslyViewedObject, index) => {
          const path = urlFor.browser({
            genomeId: previouslyViewedObject.genome_id,
            focus: previouslyViewedObject.object_id
          });

          return (
            <div key={index} className={styles.linkHolder}>
              <Link to={path} onClick={props.closeTrackPanelModal}>
                {previouslyViewedObject.label}
              </Link>
              <span className={styles.previouslyViewedType}>
                {upperFirst(previouslyViewedObject.object_type)}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export const TrackPanelBookmarks = (props: TrackPanelBookmarksProps) => {
  const {
    previouslyViewedObjects,
    exampleEnsObjects,
    activeGenomeId,
    updateTrackStatesAndSave,
    closeTrackPanelModal
  } = props;

  const limitedPreviouslyViewedObjects = previouslyViewedObjects.slice(-20);

  return (
    <section className="trackPanelBookmarks">
      <h3>Bookmarks</h3>
      {exampleEnsObjects.length ? (
        <>
          <div className={styles.title}>Example links</div>
          <ExampleLinks
            exampleEnsObjects={exampleEnsObjects}
            activeGenomeId={activeGenomeId}
            closeTrackPanelModal={closeTrackPanelModal}
          />
        </>
      ) : null}
      {limitedPreviouslyViewedObjects.length ? (
        <>
          <div className={styles.title}>
            Previously viewed
            {props.previouslyViewedObjects.length > 20 && (
              <span className={styles.ellipsis}>
                <ImageButton
                  buttonStatus={Status.ACTIVE}
                  description={'View all'}
                  image={EllipsisIcon}
                  onClick={() => props.changeDrawerViewAndOpen('bookmarks')}
                />
              </span>
            )}
          </div>
          <PreviouslyViewedLinks
            previouslyViewedObjects={limitedPreviouslyViewedObjects}
            updateTrackStatesAndSave={updateTrackStatesAndSave}
            closeTrackPanelModal={closeTrackPanelModal}
          />
        </>
      ) : null}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  exampleEnsObjects: getExampleEnsObjects(state),
  previouslyViewedObjects: getActiveGenomePreviouslyViewedObjects(state)
});

const mapDispatchToProps = {
  fetchExampleEnsObjects,
  updateTrackStatesAndSave,
  closeTrackPanelModal,
  changeDrawerViewAndOpen
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanelBookmarks);
