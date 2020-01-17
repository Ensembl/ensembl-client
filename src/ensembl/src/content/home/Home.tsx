import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { RootState } from 'src/store';

import { fetchDataForLastVisitedObjects } from 'src/content/app/browser/browserActions';
import { getGenomeInfo } from 'src/shared/state/genome/genomeSelectors';
import { getEnabledCommittedSpecies } from '../app/species-selector/state/speciesSelectorSelectors';
import {
  getPreviouslyViewedGenomeBrowserObjects,
  PreviouslyViewedGenomeBrowserObjects
} from 'src/content/home/homePageSelectors';

import HomepageSpeciesBar from 'src/content/home/components/homepage-species-bar/HomepageSpeciesBar';
import HomepageSiteInfo from 'src/content/home/components/homepage-site-info/HomepageSiteInfo';

import { GenomeInfoData } from 'src/shared/state/genome/genomeTypes';
import { CommittedItem } from '../app/species-selector/types/species-search';

import styles from './Home.scss';

type Props = {
  species: CommittedItem[];
  genomeInfo: GenomeInfoData;
  previouslyViewedGenomeBrowserObjects: PreviouslyViewedGenomeBrowserObjects;
  fetchDataForLastVisitedObjects: () => void;
};

type PreviouslyViewedProps = {
  species: CommittedItem[];
  previouslyViewedGenomeBrowserObjects: PreviouslyViewedGenomeBrowserObjects;
};

const Home = (props: Props) => {
  useEffect(() => {
    props.fetchDataForLastVisitedObjects();
  }, []);

  return (
    <div className={styles.home}>
      <HomepageSpeciesBar />
      <section className={styles.search}>
        <h2>Find</h2>
        <p>
          <input type="text" placeholder="Name, symbol or ID" disabled={true} />
        </p>
      </section>
      <PreviouslyViewed
        species={props.species}
        previouslyViewedGenomeBrowserObjects={
          props.previouslyViewedGenomeBrowserObjects
        }
      />
      <HomepageSiteInfo />
    </div>
  );
};

const PreviouslyViewed = (props: PreviouslyViewedProps) => {
  if (
    !props.species.length ||
    props.previouslyViewedGenomeBrowserObjects.areLoading
  ) {
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
  species: getEnabledCommittedSpecies(state),
  genomeInfo: getGenomeInfo(state),
  previouslyViewedGenomeBrowserObjects: getPreviouslyViewedGenomeBrowserObjects(
    state
  )
});

const mapDispatchToProps = {
  fetchDataForLastVisitedObjects
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
