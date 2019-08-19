import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { RootState } from 'src/store';
import { EnsObject } from 'src/ens-object/ensObjectTypes';
import { GenomeInfoData } from 'src/genome/genomeTypes';

import { getBrowserActiveGenomeId } from '../../../browserSelectors';
import { updateTrackStates } from 'src/content/app/browser/browserActions';
import { TrackStates } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { getGenomeInfo } from 'src/genome/genomeSelectors';
import { getActiveGenomeBookmarks } from 'src/content/app/browser/track-panel/trackPanelSelectors';
import { fetchExampleEnsObjects } from 'src/ens-object/ensObjectActions';
import { getExampleEnsObjects } from 'src/ens-object/ensObjectSelectors';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { getFormattedLocation } from 'src/shared/helpers/regionFormatter';
import { closeTrackPanelModal } from '../../trackPanelActions';

import upperFirst from 'lodash/upperFirst';

import styles from '../TrackPanelModal.scss';
import { Bookmark } from '../../trackPanelState';

type TrackPanelBookmarksProps = {
  activeGenomeId: string | null;
  genomeInfo: GenomeInfoData;
  exampleEnsObjects: EnsObject[];
  previouslyViewedObjects: Bookmark[];
};

type DispatchProps = {
  fetchExampleEnsObjects: (objectId: string) => void;
  updateTrackStates: (trackStates: TrackStates) => void;
  closeTrackPanelModal: () => void;
};
type Props = TrackPanelBookmarksProps & DispatchProps;

const getExampleObjLabel = (exampleObject: EnsObject | Bookmark) => {
  if (exampleObject.object_type === 'gene') {
    return exampleObject.label;
  } else {
    return getFormattedLocation(exampleObject.location);
  }
};

type ExampleLinksProps = Pick<
  Props,
  'exampleEnsObjects' | 'activeGenomeId' | 'closeTrackPanelModal'
>;
const ExampleLinks = (props: ExampleLinksProps) => {
  return (
    <div>
      {props.exampleEnsObjects.map((exampleObject) => {
        const locationStr = `${exampleObject.location.chromosome}:${exampleObject.location.start}-${exampleObject.location.end}`;
        const path = urlFor.browser({
          genomeId: props.activeGenomeId,
          focus: exampleObject.object_id,
          location: locationStr
        });

        const onClickHandler = () => {
          props.closeTrackPanelModal();
        };

        return (
          <dd key={exampleObject.object_id}>
            <Link to={path} onClick={onClickHandler}>
              {getExampleObjLabel(exampleObject)}
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
  Props,
  | 'previouslyViewedObjects'
  | 'updateTrackStates'
  | 'closeTrackPanelModal'
  | 'activeGenomeId'
>;

const PreviouslyViewedLinks = (props: PreviouslyViewedLinksProps) => {
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

          const onClickHandler = () => {
            props.updateTrackStates({
              [previouslyViewedObject.genome_id]: {
                ...previouslyViewedObject.trackStates
              }
            });

            props.closeTrackPanelModal();
          };

          return (
            <dd key={index}>
              <Link to={path} onClick={onClickHandler}>
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

export const TrackPanelBookmarks = (props: Props) => {
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
      <p>Save multiple browser configurations</p>
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
  genomeInfo: getGenomeInfo(state),
  exampleEnsObjects: getExampleEnsObjects(state),
  previouslyViewedObjects: getActiveGenomeBookmarks(state)
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
