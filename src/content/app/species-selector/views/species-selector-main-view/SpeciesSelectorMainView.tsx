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

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useSpeciesSelectorAnalytics from 'src/content/app/species-selector/hooks/useSpeciesSelectorAnalytics';
import { useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';
import { useGenomeGroupCategoriesQuery } from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';

import GenomeCounts from 'src/shared/components/genome-counts/GenomeCounts';
import GenomeGroups from 'src/content/app/species-selector/components/genome-groups/GenomeGroups';
import PopularSpeciesList from 'src/content/app/species-selector/components/popular-species-list/PopularSpeciesList';
import FeatureSearchField from 'src/content/app/search/components/feature-search-field/FeatureSearchField';
import SpeciesSearchField from 'src/content/app/species-selector/components/species-search-field/SpeciesSearchField';
import TextButton from 'src/shared/components/text-button/TextButton';

import styles from './SpeciesSelectorMainView.module.css';

const popularSpeciesTab = 'Popular species';

const SpeciesSelectorMainView = () => {
  const navigate = useNavigate();
  const committedSpecies = useAppSelector(getCommittedSpecies);
  const canSearchFeature = committedSpecies.length > 0;
  const { trackSpeciesSearchQuery } = useSpeciesSelectorAnalytics();
  const [activeTab, setActiveTab] = useState(popularSpeciesTab);
  const { currentData: genomeGroupCategoriesData } =
    useGenomeGroupCategoriesQuery();

  const genomeGroupCategories =
    genomeGroupCategoriesData?.group_categories ?? [];
  const tabs = [
    popularSpeciesTab,
    ...genomeGroupCategories.map((category) => category.display_name)
  ];
  const activeGenomeGroupCategory = genomeGroupCategories.find(
    (category) => category.display_name === activeTab
  );

  const onSpeciesSearchSubmit = (query: string) => {
    trackSpeciesSearchQuery(query);
    navigate(
      urlFor.speciesSelectorSearch({
        query
      })
    );
  };

  const onFeatureSearchSubmit = (query: string) => {
    navigate(
      urlFor.searchResults({
        query
      }),
      { state: { returnTo: urlFor.speciesSelector() } }
    );
  };

  return (
    <div className={styles.main}>
      <div className={styles.searchPanel}>
        <div className={styles.searchFields}>
          <SpeciesSearchField
            labelStyle="with-icon"
            onSearchSubmit={onSpeciesSearchSubmit}
          />
          <FeatureSearchField
            onSearchSubmit={onFeatureSearchSubmit}
            canSubmit={canSearchFeature}
            disabled={!canSearchFeature}
            labelStyle="with-icon"
          />
        </div>
        <GenomeCounts variety="full" className={styles.genomeCounts} />
        <SpeciesSelectorTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
      <div className={styles.tabPanel}>
        {activeTab === popularSpeciesTab && <PopularSpeciesList />}
        {activeGenomeGroupCategory && (
          <GenomeGroups category={activeGenomeGroupCategory} />
        )}
      </div>
    </div>
  );
};

const SpeciesSelectorTabs = (props: {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const { activeTab, onTabChange, tabs } = props;

  return (
    <div className={styles.tabs}>
      {tabs.map((tab) =>
        tab === activeTab ? (
          <TextButton key={tab} className={styles.activeTab} disabled>
            {tab}
          </TextButton>
        ) : (
          <TextButton key={tab} onClick={() => onTabChange(tab)}>
            {tab}
          </TextButton>
        )
      )}
    </div>
  );
};

export default SpeciesSelectorMainView;
