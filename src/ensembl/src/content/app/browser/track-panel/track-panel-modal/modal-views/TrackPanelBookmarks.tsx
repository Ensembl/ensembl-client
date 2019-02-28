import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import styles from '../TrackPanelModal.scss';

const TrackPanelBookmarks: FunctionComponent = () => {
  return (
    <section className="trackPanelBookmarks">
      <h3>Bookmarks</h3>
      <p>Save multiple browser configurations</p>
      <p>Not ready yet &hellip;</p>
      <dl className={styles.previouslyViewed}>
        <dt>Previously viewed</dt>
        <dd>
          <Link to="/app/browser/human/BRCA2/13:32315474-32400266">
            Human gene BRCA2
          </Link>
        </dd>
        <dd>
          <Link to="/app/browser/human/TTN/2:178525989-178830802">
            Human transcript TTN
          </Link>
        </dd>
      </dl>
    </section>
  );
};

export default TrackPanelBookmarks;
