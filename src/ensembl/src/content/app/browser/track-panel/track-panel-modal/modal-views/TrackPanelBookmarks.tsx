import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { RootState } from 'src/store';
import { EnsObject } from 'src/ens-object/ensObjectTypes';

import { getBrowserActiveGenomeId } from '../../../browserSelectors';
import { updateTrackStates } from 'src/content/app/browser/browserActions';
import { TrackStates } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { getActiveGenomePreviouslyViewedObjects } from 'src/content/app/browser/track-panel/trackPanelSelectors';
import { fetchExampleEnsObjects } from 'src/ens-object/ensObjectActions';
import { getExampleEnsObjects } from 'src/ens-object/ensObjectSelectors';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { getFormattedLocation } from 'src/shared/helpers/regionFormatter';
import { closeTrackPanelModal } from '../../trackPanelActions';

import upperFirst from 'lodash/upperFirst';

import styles from '../TrackPanelModal.scss';
import { Bookmark } from '../../trackPanelState';

type StateProps = {
  activeGenomeId: string | null;
  exampleEnsObjects: EnsObject[];
  previouslyViewedObjects: Bookmark[];
};

type DispatchProps = {
  fetchExampleEnsObjects: (objectId: string) => void;
  updateTrackStates: (trackStates: TrackStates) => void;
  closeTrackPanelModal: () => void;
};
export type TrackPanelBookmarksProps = StateProps & DispatchProps;

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
          <dd key={exampleObject.object_id}>
            <Link to={path} onClick={props.closeTrackPanelModal}>
              {exampleObject.label}
            </Link>
            <span className={styles.previouslyViewedType}>
              {' '}
              {upperFirst(exampleObject.object_type)}
            </span>
          </dd>
        );
      })}
    </div>
  );
};

type PreviouslyViewedLinksProps = Pick<
  TrackPanelBookmarksProps,
  | 'previouslyViewedObjects'
  | 'updateTrackStates'
  | 'closeTrackPanelModal'
  | 'activeGenomeId'
>;

export const PreviouslyViewedLinks = (props: PreviouslyViewedLinksProps) => {
  
  const onClickHandler = (previouslyViewedObject: Bookmark) => {
    props.updateTrackStates({
      [previouslyViewedObject.genome_id]: {
        ...previouslyViewedObject.trackStates
      }
    });

    props.closeTrackPanelModal();
  };


  return (
    <div>
      {[...props.previouslyViewedObjects]
        .reverse()
        .map((previouslyViewedObject, index) => {
          const locationStr = `${previouslyViewedObject.location.chromosome}:${previouslyViewedObject.location.start}-${previouslyViewedObject.location.end}`;
          const path = urlFor.browser({
            genomeId: props.activeGenomeId,
            focus: previouslyViewedObject.object_id,
            location: locationStr
          });
          
          return (
            <dd key={index}>
              <Link to={path} onClick={() => onClickHandler(previouslyViewedObject)}>
                {previouslyViewedObject.label}
              </Link>
              <span className={styles.previouslyViewedType}>
                {' '}
                {upperFirst(previouslyViewedObject.object_type)}
              </span>
            </dd>
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
    updateTrackStates,
    closeTrackPanelModal
  } = props;

  return (
    <section className="trackPanelBookmarks">
      <h3>Bookmarks</h3>
      {exampleEnsObjects.length ? (
        <dl className={styles.previouslyViewed}>
          <dt>Example links</dt>
          <ExampleLinks
            exampleEnsObjects={exampleEnsObjects}
            activeGenomeId={activeGenomeId}
            closeTrackPanelModal={closeTrackPanelModal}
          />
        </dl>
      ) : null}
      {previouslyViewedObjects.length ? (
        <dl className={styles.previouslyViewed}>
          <dt>Previously viewed</dt>
          <PreviouslyViewedLinks
            previouslyViewedObjects={previouslyViewedObjects}
            activeGenomeId={activeGenomeId}
            updateTrackStates={updateTrackStates}
            closeTrackPanelModal={closeTrackPanelModal}
          />
        </dl>
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
  updateTrackStates,
  closeTrackPanelModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanelBookmarks);
