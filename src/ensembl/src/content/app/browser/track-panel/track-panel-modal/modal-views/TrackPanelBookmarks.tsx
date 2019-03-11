import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import styles from '../TrackPanelModal.scss';

type TrackPanelBookmarksProps = {
  exampleObjects: any;
};

const TrackPanelBookmarks: FunctionComponent<TrackPanelBookmarksProps> = (
  props: TrackPanelBookmarksProps
) => {
  const exampleObjectsTotal = Object.keys(props.exampleObjects).length;

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
    const path = `/app/browser/${assemblyStr}/${stable_id}/${regionStr}`;

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

export default TrackPanelBookmarks;
