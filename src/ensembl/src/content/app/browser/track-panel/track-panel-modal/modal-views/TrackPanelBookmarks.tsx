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
};
type Props = TrackPanelBookmarksProps & DispatchProps;

type ExampleLinksProps = {
  activeGenomeId: string | null;
  exampleEnsObjects: EnsObject[];
};

type PreviouslyViewedLinksProps = {
  previouslyViewedObjects: Bookmark[];
  updateTrackStates: (trackStates: TrackStates) => void;
  activeGenomeId: string | null;
};

const getExampleObjLabel = (exampleObject: EnsObject | Bookmark) => {
  if (exampleObject.object_type === 'gene') {
    return exampleObject.label;
  } else {
    return getFormattedLocation(exampleObject.location);
  }
};

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

        return (
          <dd key={exampleObject.object_id}>
            <Link to={path}>{getExampleObjLabel(exampleObject)}</Link>
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

const PreviouslyViewedLinks = (props: PreviouslyViewedLinksProps) => {
  return (
    <div>
      {[...props.previouslyViewedObjects].reverse().map((bookmark, index) => {
        const locationStr = `${bookmark.location.chromosome}:${bookmark.location.start}-${bookmark.location.end}`;
        const path = urlFor.browser({
          genomeId: props.activeGenomeId,
          focus: bookmark.object_id,
          location: locationStr
        });

        return (
          <dd key={index}>
            <Link
              to={path}
              onClick={() => {
                props.updateTrackStates({
                  [bookmark.genome_id]: {
                    ...bookmark.trackStates
                  }
                });
              }}
            >
              {bookmark.label}
            </Link>
            <span className={styles.previouslyViewedType}>
              {' '}
              {upperFirst(bookmark.object_type)}
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
    updateTrackStates
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
  updateTrackStates
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanelBookmarks);
