import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { RootState } from 'src/store';
import { getExampleEnsObjects } from 'src/ens-object/ensObjectSelectors';
import { fetchExampleEnsObjectsData } from 'src/ens-object/ensObjectActions';

import styles from '../TrackPanelModal.scss';

type StateProps = {
  exampleEnsObjects: any;
};

type DispatchProps = {
  fetchExampleEnsObjectsData: () => void;
};

type OwnProps = {};

type TrackPanelBookmarksProps = StateProps & DispatchProps & OwnProps;

export const TrackPanelBookmarks = (props: TrackPanelBookmarksProps) => {
  const exampleObjectsTotal = Object.keys(props.exampleEnsObjects).length;

  useEffect(() => {
    if (exampleObjectsTotal === 0) {
      props.fetchExampleEnsObjectsData();
    }
  }, [props.exampleEnsObjects]);

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
    const genomeId = `${assembly.name}_demo`;
    const locationStr = `${chromosome}:${location.start}-${location.end}`;
    const path = `/app/browser/${genomeId}?focus=${stable_id}&location=${locationStr}`;

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
          {Object.values(props.exampleEnsObjects).map((exampleObject) =>
            getExampleObjectNode(exampleObject)
          )}
        </dl>
      ) : null}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  exampleEnsObjects: getExampleEnsObjects(state)
});

const mapDispatchToProps = {
  fetchExampleEnsObjectsData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanelBookmarks);
