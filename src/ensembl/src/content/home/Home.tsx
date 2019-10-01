import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { RootState } from 'src/store';

import { fetchDataForLastVisitedObjects } from 'src/content/app/browser/browserActions';
import { getGenomeInfo } from 'src/genome/genomeSelectors';
import { getEnabledCommittedSpecies } from '../app/species-selector/state/speciesSelectorSelectors';
import {
  getPreviouslyViewedGenomeBrowserObjects,
  PreviouslyViewedGenomeBrowserObjects
} from 'src/content/home/homePageSelectors';

import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';
import { SimpleSelectedSpecies } from 'src/shared/components/selected-species';

import { GenomeInfoData } from 'src/genome/genomeTypes';
import { CommittedItem } from '../app/species-selector/types/species-search';

import styles from './Home.scss';

type Props = {
  activeSpecies: CommittedItem[];
  genomeInfo: GenomeInfoData;
  previouslyViewedGenomeBrowserObjects: PreviouslyViewedGenomeBrowserObjects;
  fetchDataForLastVisitedObjects: () => void;
};

type PreviouslyViewedProps = {
  previouslyViewedGenomeBrowserObjects: PreviouslyViewedGenomeBrowserObjects;
};

const Home = (props: Props) => {
  useEffect(() => {
    props.fetchDataForLastVisitedObjects();
  }, []);

  const totalSelectedSpecies = props.activeSpecies.length;

  return (
    <div className={styles.home}>
      <SpeciesBar species={props.activeSpecies} />
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

const SpeciesBar = (props: { species: CommittedItem[] }) => {
  let barContent;
  if (!props.species.length) {
    barContent = (
      <div className={styles.emptySpeciesBar}>
        <span className={styles.speciesSelectorBannerText}>
          7 species now available
        </span>
        <Link
          className={styles.speciesSelectorBannerLink}
          to={urlFor.speciesSelector()}
        >
          Select a species to begin
        </Link>
      </div>
    );
  } else {
    const speciesItems = props.species.map((species, index) => (
      <SimpleSelectedSpecies key={index} species={species} />
    ));
    barContent = <SpeciesTabsWrapper speciesTabs={speciesItems} />;
  }

  return <div className={styles.speciesBar}>{barContent}</div>;
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
  activeSpecies: getEnabledCommittedSpecies(state),
  genomeInfo: getGenomeInfo(state),
  previouslyViewedGenomeBrowserObjects: getPreviouslyViewedGenomeBrowserObjects(
    state
  )
});

const mapDispatchToProps = {
  fetchDataForLastVisitedObjects
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
