/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';
import useOutsideClick from 'src/shared/hooks/useOutsideClick';

import { fetchDataForLastVisitedObjects } from 'src/content/app/browser/browserActions';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import {
  getPreviouslyViewedGenomeBrowserObjects,
  PreviouslyViewedGenomeBrowserObjects
} from 'src/content/home/homePageSelectors';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';

import { ReactComponent as InfoIcon } from 'static/img/shared/info_circle.svg';

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

  const onToggleRow = (index: number | null) => {
    if (index === expandedRowIndex) {
      setExpandedRowIndex(null);
    } else {
      setExpandedRowIndex(index);
    }
  };

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
};

const HomepageAppLinksRow = (props: HomepageAppLinksRowProps) => {
  const { species, isExpanded, toggleExpand } = props;
  const elementRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const onOutsideClick = () => {
    isExpanded && toggleExpand();
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
          status={Status.DEFAULT}
          description="Species home page"
          image={InfoIcon}
          className={styles.speciesInfoButton}
          onClick={() =>
            dispatch(push(urlFor.speciesPage({ genomeId: species.genome_id })))
          }
        />
      </div>
      <div className={styles.homepageAppLinkButtons}>
        <ViewInApp
          links={{
            genomeBrowser: {
              url: urlFor.browser({ genomeId: species.genome_id })
            },
            entityViewer: {
              url: urlFor.entityViewer({ genomeId: species.genome_id })
            }
          }}
        />
      </div>
    </div>
  ) : (
    <div className={rowClasses}>{speciesName}</div>
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
