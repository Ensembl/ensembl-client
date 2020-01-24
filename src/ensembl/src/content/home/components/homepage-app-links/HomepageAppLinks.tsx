import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { isEnvironment, Environment } from 'src/shared/helpers/environment';
import * as urlFor from 'src/shared/helpers/urlHelper';
import useOutsideClick from 'src/shared/hooks/useOutsideClick';

import { fetchDataForLastVisitedObjects } from 'src/content/app/browser/browserActions';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import {
  getPreviouslyViewedGenomeBrowserObjects,
  PreviouslyViewedGenomeBrowserObjects
} from 'src/content/home/homePageSelectors';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as BrowserIcon } from 'static/img/launchbar/browser.svg';
import { ReactComponent as EntityViewerIcon } from 'static/img/launchbar/entity-viewer.svg';
import { ReactComponent as HomeIcon } from 'static/img/header/home.svg';

import { RootState } from 'src/store';
import { Status } from 'src/shared/types/status';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

import styles from './HomepageAppLinks.scss';

type Props = {
  species: CommittedItem[];
  previouslyViewedGenomeBrowserObjects: PreviouslyViewedGenomeBrowserObjects;
  fetchDataForLastVisitedObjects: () => void;
};

type HomepageAppLinksRowProps = {
  species: CommittedItem;
  isExpanded: boolean;
  toggleExpand: () => void;
};

const HomepageAppLinks = (props: Props) => {
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);

  const onToggleRow = (index: number) => {
    if (index === expandedRowIndex) {
      setExpandedRowIndex(null);
    } else {
      setExpandedRowIndex(index);
    }
  };

  if (isEnvironment([Environment.DEVELOPMENT, Environment.INTERNAL])) {
    const links = props.species.map((species, index) => (
      <HomepageAppLinksRow
        key={species.genome_id}
        species={species}
        isExpanded={expandedRowIndex === index}
        toggleExpand={() => onToggleRow(index)}
      />
    ));
    return (
      <section className={styles.homepageAppLinks}>
        <h2>Previously viewed</h2>
        {links}
      </section>
    );
  } else {
    return <PreviouslyViewedLinks {...props} />;
  }
};

const HomepageAppLinksRow = (props: HomepageAppLinksRowProps) => {
  const { species, isExpanded, toggleExpand } = props;
  const elementRef = useRef<HTMLDivElement>(null);

  const onOutsideClick = () => {
    toggleExpand();
  };

  useOutsideClick(elementRef, onOutsideClick);

  const rowClasses = classNames(styles.homepageAppLinksRow, {
    [styles.homepageAppLinksRowExpanded]: isExpanded
  });

  const onNameClick = isExpanded ? null : { onClick: toggleExpand };

  const speciesName = (
    <div className={styles.speciesNameColumn}>
      <span className={styles.speciesName} {...onNameClick}>
        {species.common_name || species.scientific_name}
      </span>
      <span className={styles.assemblyName}>{species.assembly_name}</span>
    </div>
  );

  return isExpanded ? (
    <div ref={elementRef} className={rowClasses}>
      {speciesName}
      <div>
        <ImageButton
          classNames={{
            [Status.DEFAULT]: styles.speciesHomeButton
          }}
          buttonStatus={Status.DEFAULT}
          description="Species home page"
          image={HomeIcon}
        />
      </div>
      <div className={styles.homepageAppLinkButtons}>
        <span className={styles.viewIn}>View in</span>
        <Link className={styles.homepageAppLink} to={urlFor.browser()}>
          <ImageButton
            classNames={{
              [Status.DEFAULT]: styles.homepageAppLinkButton
            }}
            buttonStatus={Status.DEFAULT}
            description="Genome browser"
            image={BrowserIcon}
          />
        </Link>
        <Link className={styles.homepageAppLink} to={urlFor.entityViewer()}>
          <ImageButton
            classNames={{
              [Status.DEFAULT]: styles.homepageAppLinkButton
            }}
            buttonStatus={Status.DEFAULT}
            description="Entity viewer"
            image={EntityViewerIcon}
          />
        </Link>
      </div>
    </div>
  ) : (
    <div className={rowClasses}>{speciesName}</div>
  );
};

// Legacy component that stays there until we have a presentable EntityViewer
const PreviouslyViewedLinks = (props: Props) => {
  useEffect(() => {
    props.fetchDataForLastVisitedObjects();
  }, []);

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
  previouslyViewedGenomeBrowserObjects: getPreviouslyViewedGenomeBrowserObjects(
    state
  )
});

const mapDispatchToProps = {
  fetchDataForLastVisitedObjects
};

export default connect(mapStateToProps, mapDispatchToProps)(HomepageAppLinks);
