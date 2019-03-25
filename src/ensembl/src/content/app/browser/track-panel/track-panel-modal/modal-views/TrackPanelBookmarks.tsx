import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { RootState } from 'src/store';
import { getExampleObjects } from 'src/object/objectSelectors';
import { fetchExampleObjectsData } from 'src/object/objectActions';

import styles from '../TrackPanelModal.scss';

type StateProps = {
  exampleObjects: any;
};

type DispatchProps = {
  fetchExampleObjectsData: () => void;
};

type OwnProps = {};

type TrackPanelBookmarksProps = StateProps & DispatchProps & OwnProps;

export const TrackPanelBookmarks = (props: TrackPanelBookmarksProps) => {
  const exampleObjectsTotal = Object.keys(props.exampleObjects).length;

  useEffect(() => {
    if (exampleObjectsTotal === 0) {
      props.fetchExampleObjectsData();
    }
  }, [props.exampleObjects]);

  const getExampleObjectNode = (exampleObject: any) => {
    const {
      assembly,
      chromosome,
      display_name,
      location,
      object_type,
      species,
      stable_id
    } = exampleObject;
    const assemblyStr = `${assembly.name}_demo`;
    const regionStr = `${chromosome}:${location.start}-${location.end}`;
    const path = `/app/browser/${assemblyStr}/${stable_id}?region=${regionStr}`;

    return (
      <dd key={stable_id}>
        <Link to={path}>
          {species} {object_type} {display_name}
        </Link>
      </dd>
    );
  };

  return (
    <section className="trackPanelBookmarks">
      <h3>Bookmarks</h3>
      <p>Save multiple browser configurations</p>
      <p>Not ready yet &hellip;</p>
      {exampleObjectsTotal ? (
        <dl className={styles.previouslyViewed}>
          <dt>Previously viewed</dt>
          {Object.values(props.exampleObjects).map((exampleObject) =>
            getExampleObjectNode(exampleObject)
          )}
        </dl>
      ) : null}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  exampleObjects: getExampleObjects(state)
});

const mapDispatchToProps = {
  fetchExampleObjectsData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanelBookmarks);
