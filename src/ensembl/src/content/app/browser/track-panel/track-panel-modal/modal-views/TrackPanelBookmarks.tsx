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
  bookmarks: Bookmark[];
};

type DispatchProps = {
  fetchExampleEnsObjects: (objectId: string) => void;
  updateTrackStates: (trackStates: TrackStates) => void;
};

export const TrackPanelBookmarks = (props: TrackPanelBookmarksProps) => {
  const getExampleObjLabel = (exampleObject: EnsObject | Bookmark) => {
    if (exampleObject.object_type === 'gene') {
      return exampleObject.label;
    } else {
      return getFormattedLocation(exampleObject.location);
    }
  };

  const getExampleLinks = () => {
    return props.exampleEnsObjects.map((exampleObject) => {
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
    });
  };

  const getBookmarkedLinks = () => {
    return [...props.bookmarks].reverse().map((bookmark, index) => {
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
    });
  };

  return (
    <section className="trackPanelBookmarks">
      <h3>Bookmarks</h3>
      <p>Save multiple browser configurations</p>
      {props.exampleEnsObjects.length ? (
        <dl className={styles.previouslyViewed}>
          <dt>Example links</dt>
          {getExampleLinks()}
        </dl>
      ) : null}
      {props.bookmarks.length ? (
        <dl className={styles.previouslyViewed}>
          <dt>Previously viewed</dt>
          {getBookmarkedLinks()}
        </dl>
      ) : null}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  genomeInfo: getGenomeInfo(state),
  exampleEnsObjects: getExampleEnsObjects(state),
  bookmarks: getActiveGenomeBookmarks(state)
});

const mapDispatchToProps = {
  fetchExampleEnsObjects,
  updateTrackStates
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanelBookmarks);
