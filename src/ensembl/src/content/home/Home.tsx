import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { RootState } from 'src/store';

import { fetchExampleEnsObjects } from 'src/ens-object/ensObjectActions';
import { EnsObject } from 'src/ens-object/ensObjectTypes';
import { getExampleEnsObjects } from 'src/ens-object/ensObjectSelectors';

import { getCommittedSpecies } from '../app/species-selector/state/speciesSelectorSelectors';
import { CommittedItem } from '../app/species-selector/types/species-search';

import styles from './Home.scss';

type StateProps = {
  activeSpecies: CommittedItem[];
  exampleEnsObjects: EnsObject[];
  totalSelectedSpecies: number;
};

type DispatchProps = {
  fetchExampleEnsObjects: () => void;
};

type OwnProps = {};

type HomeProps = StateProps & DispatchProps & OwnProps;

const Home: FunctionComponent<HomeProps> = (props: HomeProps) => {
  const [showPreviouslyViewed, toggleShowPreviouslyViewed] = useState(false);

  useEffect(() => {
    props.fetchExampleEnsObjects();
  }, []);

  useEffect(() => {
    if (props.exampleEnsObjects.length > 0) {
      toggleShowPreviouslyViewed(true);
    }
  }, [props.exampleEnsObjects]);

  const getExampleObjectNode = (exampleObject: EnsObject) => {
    const genomeInfo = props.activeSpecies.filter(
      (species: CommittedItem) => species.genome_id === exampleObject.genome_id
    )[0];

    const locationStr = `${exampleObject.location.chromosome}:${exampleObject.location.start}-${exampleObject.location.end}`;
    const path = urlFor.browser(
      genomeInfo.genome_id,
      exampleObject.ensembl_object_id,
      locationStr
    );

    return (
      <dd key={exampleObject.ensembl_object_id}>
        <Link to={path}>
          {genomeInfo.common_name} {exampleObject.label}
        </Link>
      </dd>
    );
  };

  return (
    <div className={styles.home}>
      {!props.totalSelectedSpecies && (
        <>
          <span className={styles.speciesSelectorBannerText}>
            7 species now available
          </span>
          <Link
            className={styles.speciesSelectorBannerLink}
            to={urlFor.speciesSelector()}
          >
            Select a species to begin
          </Link>
        </>
      )}
      <section className={styles.search}>
        <h2>Find</h2>
        <p>
          <input type="text" placeholder="Name, symbol or ID" disabled={true} />
          {/* <button disabled={true}>Go</button> */}
        </p>
        <div className={styles.filter}>
          <h2>Refine results</h2>
        </div>
      </section>
      {showPreviouslyViewed ? (
        <section className={styles.previouslyViewed}>
          <h2>Previously viewed</h2>
          <dl>
            {props.exampleEnsObjects.map((exampleObject: EnsObject) =>
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
          Blue icons and text are clickable and will usually 'do' something.
        </p>
        <p>
          Grey icons indicate apps &amp; functionality that is planned, but not
          available yet.
        </p>
        <p className={styles.convoMessage}>
          It's very early days, but why not join the conversation:
        </p>
        <p>helpdesk@ensembl.org</p>
      </section>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeSpecies: getCommittedSpecies(state),
  exampleEnsObjects: getExampleEnsObjects(state),
  totalSelectedSpecies: getCommittedSpecies(state).length
});

const mapDispatchToProps = {
  fetchExampleEnsObjects
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
