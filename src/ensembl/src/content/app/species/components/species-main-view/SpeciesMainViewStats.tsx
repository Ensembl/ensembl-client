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

import React, { useEffect, ReactNode } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import useAnalyticsService from 'ensemblRoot/src/shared/hooks/useAnalyticsService';

import ViewInAppPopup from 'src/shared/components/view-in-app-popup/ViewInAppPopup';
import SpeciesStats from 'src/content/app/species/components/species-stats/SpeciesStats';
import ExpandableSection from 'src/shared/components/expandable-section/ExpandableSection';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';

import {
  getActiveGenomeId,
  getActiveGenomeStats,
  getActiveGenomeUIState
} from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { getGenomeExampleFocusObjects } from 'src/shared/state/genome/genomeSelectors';
import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import {
  fetchStatsForActiveGenome,
  setActiveGenomeExpandedSections,
  GenomeUIState
} from 'src/content/app/species/state/general/speciesGeneralSlice';

import { RootState } from 'src/store';
import { ExampleFocusObject } from 'src/shared/state/genome/genomeTypes';
import { GenomeStats } from '../../state/general/speciesGeneralSlice';
import { UrlObj } from 'src/shared/components/view-in-app/ViewInApp';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';
import {
  StatsSection,
  sectionGroupsMap,
  SpeciesStatsSection
} from '../../state/general/speciesGeneralHelper';

import styles from './SpeciesMainView.scss';

type Props = {
  activeGenomeId: string | null;
  genomeStats: GenomeStats | undefined;
  genomeUIState: GenomeUIState | undefined;
  exampleFocusObjects: ExampleFocusObject[];
  species: CommittedItem | null;
  fetchStatsForActiveGenome: () => void;
  setExpandedSections: (expandedSections: SpeciesStatsSection[]) => void;
};

type ExampleLinkPopupProps = {
  links: UrlObj;
  children: ReactNode;
};

const ExampleLinkWithPopup = (props: ExampleLinkPopupProps) => {
  return (
    <div className={styles.exampleLink}>
      <ViewInAppPopup links={props.links}>
        <span className={styles.exampleLinkText}>{props.children}</span>
      </ViewInAppPopup>
    </div>
  );
};

type ContentProps = {
  statsSection: StatsSection;
  species: CommittedItem;
  trackSpeciesPageExampleLink: (
    species: CommittedItem,
    linkText: string
  ) => void;
};

const getCollapsedContent = (props: ContentProps) => {
  const { species, statsSection } = props;
  const { summaryStats, section, exampleLinks } = statsSection;
  const { title, helpText, exampleLinkText } = sectionGroupsMap[section];

  const onExampleLinkClick = () => {
    props.trackSpeciesPageExampleLink(props.species, exampleLinkText as string);
  };

  return (
    <div className={styles.collapsedContent}>
      <span className={styles.title}>{title}</span>
      {summaryStats?.length ? (
        summaryStats.map((summaryStat, index) => {
          return (
            <div className={styles.summaryStat} key={index}>
              <span className={styles.value}>{summaryStat.primaryValue}</span>
              <span className={styles.unit}>{summaryStat.primaryUnit}</span>
              {helpText && (
                <span className={styles.questionButton}>
                  <QuestionButton helpText={helpText} />
                </span>
              )}
            </div>
          );
        })
      ) : (
        <div className={styles.noData}>no data</div>
      )}

      {exampleLinks && species.isEnabled && (
        <ExampleLinkWithPopup links={exampleLinks}>
          <span onClick={onExampleLinkClick}>{exampleLinkText}</span>
        </ExampleLinkWithPopup>
      )}
    </div>
  );
};

const getExpandedContent = (props: ContentProps) => {
  const { species, statsSection } = props;
  const { groups, exampleLinks, section } = statsSection;
  const { exampleLinkText } = sectionGroupsMap[section];

  const onExampleLinkClick = () => {
    props.trackSpeciesPageExampleLink(props.species, exampleLinkText as string);
  };

  const expandedContent = groups
    .map((group, group_index) => {
      const { title, stats } = group;
      return stats
        ? stats.map((groupStats, row_index) => {
            const statsGroupClassName = classNames(styles.statsGroup, {
              [styles.statsGroupWithExampleLink]:
                !group_index && !row_index && exampleLinkText
            });
            return (
              <div key={row_index} className={statsGroupClassName}>
                {row_index === 0 && (
                  <span className={styles.title}>{title}</span>
                )}
                <div className={styles.stats}>
                  {groupStats.map((stat, stat_index) => {
                    return <SpeciesStats key={stat_index} {...stat} />;
                  })}
                </div>
                {group_index === 0 &&
                  row_index === 0 &&
                  exampleLinks &&
                  species.isEnabled && (
                    <ExampleLinkWithPopup links={exampleLinks}>
                      <span onClick={onExampleLinkClick}>
                        {exampleLinkText}
                      </span>
                    </ExampleLinkWithPopup>
                  )}
              </div>
            );
          })
        : null;
    })
    .filter(Boolean);

  return expandedContent.length ? (
    <div className={styles.expandedContent}>{expandedContent}</div>
  ) : null;
};

const SpeciesMainViewStats = (props: Props) => {
  useEffect(() => {
    if (!props.genomeStats && props.exampleFocusObjects?.length) {
      props.fetchStatsForActiveGenome();
    }
  }, [props.genomeStats, props.activeGenomeId, props.exampleFocusObjects]);

  const { trackSpeciesPageExampleLink, trackSpeciesStatsSectionOpen } =
    useAnalyticsService();

  const expandedSections = props.genomeUIState
    ? props.genomeUIState.expandedSections
    : [];

  if (
    !props.genomeStats ||
    !props.exampleFocusObjects?.length ||
    !props.species
  ) {
    return null;
  }

  const onSectionToggle = (
    section: SpeciesStatsSection,
    isExpanded: boolean
  ) => {
    if (isExpanded) {
      props.species && trackSpeciesStatsSectionOpen(props.species, section);
      props.setExpandedSections([...expandedSections, section]);
    } else {
      props.setExpandedSections(expandedSections.filter((s) => s !== section));
    }
  };

  return (
    <div className={styles.statsWrapper}>
      {props.genomeStats.map((statsSection, key) => {
        const contentProps = {
          statsSection,
          species: props.species as CommittedItem,
          trackSpeciesPageExampleLink
        };
        return (
          <ExpandableSection
            key={key}
            collapsedContent={getCollapsedContent(contentProps)}
            expandedContent={
              contentProps.statsSection.summaryStats?.length &&
              contentProps.statsSection.groups
                ? getExpandedContent(contentProps)
                : null
            }
            isExpanded={expandedSections.includes(statsSection.section)}
            onToggle={(isEnabled) =>
              onSectionToggle(statsSection.section, isEnabled)
            }
          />
        );
      })}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const activeGenomeId = getActiveGenomeId(state);

  return {
    activeGenomeId,
    genomeStats: getActiveGenomeStats(state),
    genomeUIState: getActiveGenomeUIState(state),
    exampleFocusObjects: activeGenomeId
      ? getGenomeExampleFocusObjects(state, activeGenomeId)
      : [],
    species: activeGenomeId
      ? getCommittedSpeciesById(state, activeGenomeId)
      : null
  };
};

const mapDispatchToProps = {
  fetchStatsForActiveGenome,
  setExpandedSections: setActiveGenomeExpandedSections
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeciesMainViewStats);
