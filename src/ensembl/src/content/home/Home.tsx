import React, { FunctionComponent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import styles from './Home.scss';
import { fetchExampleObjectsData } from '../app/browser/browserActions';
import { getExampleObjects } from '../app/browser/browserSelectors';
import { RootState } from 'src/rootReducer';

type StateProps = {
  exampleObjects: {};
};

type DispatchProps = {
  fetchExampleObjectsData: () => void;
};

type OwnProps = {};

type HomeProps = StateProps & DispatchProps & OwnProps;

const Home: FunctionComponent<HomeProps> = (props: HomeProps) => {
  useEffect(() => {
    props.fetchExampleObjectsData();
  }, []);

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
    const path = `/app/browser/${assemblyStr}/${display_name}/${regionStr}`;

    return (
      <dd key={stable_id}>
        <Link to={path}>
          {species} {object_type} {display_name}
        </Link>
      </dd>
    );
  };

  return (
    <div className={styles.home}>
      <section className={styles.search}>
        <h2>Find</h2>
        <p>
          <input type="text" placeholder="Name, symbol or ID" />
          <button disabled={true}>Go</button>
        </p>
        <div className={styles.filter}>
          <h2>Refine results</h2>
        </div>
      </section>
      {exampleObjectsTotal ? (
        <section className={styles.previouslyViewed}>
          <h2>Previously viewed</h2>
          <dl>
            {Object.values(props.exampleObjects).map((exampleObject) =>
              getExampleObjectNode(exampleObject)
            )}
          </dl>
        </section>
      ) : null}
      <section className={styles.siteMessage}>
        <h4>Using the site</h4>
        <p>
          A very limited data set has been made available for this first
          release.
        </p>
        <p>
          Blue icons and text are clickable and will usually &lsquo;do&rsquo;
          something.
        </p>
        <p>
          Grey icons indicate apps &amp; functionality that is planned, but not
          available yet.
        </p>
      </section>
    </div>
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
)(Home);
