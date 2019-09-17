import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { RootState } from 'src/store';

import { fetchDataForLastVisitedObjects } from 'src/content/app/browser/browserActions';
import { getExampleEnsObjects } from 'src/ens-object/ensObjectSelectors';
import { getGenomeInfo } from 'src/genome/genomeSelectors';
import { getCommittedSpecies } from '../app/species-selector/state/speciesSelectorSelectors';
import { fetchGenomeInfo } from 'src/genome/genomeActions';
import {
  getPreviouslyViewedGenomeBrowserObjects,
  PreviouslyViewedGenomeBrowserObjects
} from 'src/content/home/homePageSelectors';

import { EnsObject } from 'src/ens-object/ensObjectTypes';
import { GenomeInfoData } from 'src/genome/genomeTypes';
import { CommittedItem } from '../app/species-selector/types/species-search';

import styles from './Home.scss';

type Props = {
  activeSpecies: CommittedItem[];
  exampleEnsObjects: EnsObject[];
  genomeInfo: GenomeInfoData;
  totalSelectedSpecies: number;
  previouslyViewedGenomeBrowserObjects: PreviouslyViewedGenomeBrowserObjects;
  fetchGenomeInfo: () => void;
  fetchDataForLastVisitedObjects: () => void;
};

type PreviouslyViewedProps = {
  previouslyViewedGenomeBrowserObjects: PreviouslyViewedGenomeBrowserObjects;
};

const Home = (props: Props) => {
  useEffect(() => {
    props.fetchGenomeInfo();
  }, [props.activeSpecies]);

  useEffect(() => {
    props.fetchDataForLastVisitedObjects();
  }, [props.genomeInfo]);

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
        </p>
      </section>
      <PreviouslyViewed
        previouslyViewedGenomeBrowserObjects={
          props.previouslyViewedGenomeBrowserObjects
        }
      />
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

const PreviouslyViewed = (props: PreviouslyViewedProps) => {
  if (props.previouslyViewedGenomeBrowserObjects.areLoading) {
    return null;
  }

  const previouslyViewedLinks = props.previouslyViewedGenomeBrowserObjects.objects.map(
    (object, index) => (
      <div key={index} className={styles.previouslyViewedItem}>
        <Link to={object.link}>{object.speciesName}</Link>
        <span className={styles.previouslyViewedItemAssemblyName}>
          {' '}
          {object.assemblyName}
        </span>
      </div>
    )
  );

  return (
    <section className={styles.previouslyViewed}>
      <h2>Previously viewed</h2>
      {previouslyViewedLinks}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeSpecies: getCommittedSpecies(state),
  exampleEnsObjects: getExampleEnsObjects(state),
  totalSelectedSpecies: getCommittedSpecies(state).length,
  genomeInfo: getGenomeInfo(state),
  previouslyViewedGenomeBrowserObjects: getPreviouslyViewedGenomeBrowserObjects(
    state
  )
});

const mapDispatchToProps = {
  fetchGenomeInfo,
  fetchDataForLastVisitedObjects
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
