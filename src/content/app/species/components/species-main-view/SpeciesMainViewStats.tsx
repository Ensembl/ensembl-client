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

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from 'src/store';
import useSpeciesAnalytics from '../../hooks/useSpeciesAnalytics';
import { useUrlParams } from 'src/shared/hooks/useUrlParams';

import {
  getActiveGenomeId,
  getActiveGenomeUIState
} from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import {
  sectionGroupsMap,
  type SpeciesStatsSection,
  type StatsSection
} from '../../state/general/speciesGeneralHelper';
import prepareSpeciesStats from './prepareStatistics';

import { useGetSpeciesStatisticsQuery } from 'src/content/app/species/state/api/speciesApiSlice';
import { setActiveGenomeExpandedSections } from 'src/content/app/species/state/general/speciesGeneralSlice';
import { useExampleObjectsForGenomeQuery } from 'src/shared/state/genome/genomeApiSlice';

import ViewInAppPopup from 'src/shared/components/view-in-app-popup/ViewInAppPopup';
import SpeciesStats from 'src/content/app/species/components/species-stats/SpeciesStats';
import ExpandableSection from 'src/shared/components/expandable-section/ExpandableSection';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';
import { CircleLoader } from 'src/shared/components/loader';

import type { RootState } from 'src/store';
import type { LinksConfig } from 'src/shared/components/view-in-app/ViewInApp';
import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

import styles from './SpeciesMainView.scss';

type ExampleLinkPopupProps = {
  links: LinksConfig;
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
  const { title, exampleLinkText } = sectionGroupsMap[section];

  const onExampleLinkClick = () => {
    props.trackSpeciesPageExampleLink(species, exampleLinkText as string);
  };

  return (
    <div className={styles.collapsedContent}>
      <div className={styles.collapsedContentGrid}>
        <span className={styles.title}>{title}</span>

        <div className={styles.statisticsContainer}>
          {summaryStats?.length ? (
            summaryStats.map((summaryStat, index) => {
              return (
                <div className={styles.summaryStat} key={index}>
                  <span className={styles.value}>
                    {summaryStat.primaryValue}
                  </span>
                  <span className={styles.unit}>{summaryStat.primaryUnit}</span>
                  {summaryStat.helpText && (
                    <span className={styles.questionButton}>
                      <QuestionButton helpText={summaryStat.helpText} />
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className={styles.noData}>no data</div>
          )}
        </div>

        {exampleLinks && species.isEnabled && (
          <ExampleLinkWithPopup links={exampleLinks}>
            <span onClick={onExampleLinkClick}>{exampleLinkText}</span>
          </ExampleLinkWithPopup>
        )}
      </div>
    </div>
  );
};

const getExpandedContent = (props: ContentProps) => {
  const { species, statsSection } = props;
  const { groups, exampleLinks, section } = statsSection;
  const { exampleLinkText } = sectionGroupsMap[section];

  const onExampleLinkClick = () => {
    props.trackSpeciesPageExampleLink(species, exampleLinkText as string);
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

  // TODO: here
  return expandedContent.length ? (
    <div className={styles.expandedContent}>{expandedContent}</div>
  ) : null;
};

const SpeciesMainViewStats = () => {
  const dispatch = useAppDispatch();
  const activeGenomeId = useAppSelector(getActiveGenomeId);
  const genomeUIState = useAppSelector(getActiveGenomeUIState);
  const { genomeId: genomeIdForUrl } = useUrlParams<'genomeId'>(
    '/species/:genomeId'
  ) as { genomeId: string };
  const species = useAppSelector((state: RootState) =>
    getCommittedSpeciesById(state, activeGenomeId)
  );

  const { currentData: statisticsResponse, isFetching: isFetchingStatistics } =
    useGetSpeciesStatisticsQuery(
      {
        genomeId: activeGenomeId ?? ''
      },
      {
        skip: !activeGenomeId
      }
    );
  const { currentData: exampleObjects } = useExampleObjectsForGenomeQuery(
    activeGenomeId ?? '',
    {
      skip: !activeGenomeId
    }
  );

  const { trackSpeciesPageExampleLink, trackSpeciesStatsSectionOpen } =
    useSpeciesAnalytics();

  const expandedSections = genomeUIState ? genomeUIState.expandedSections : [];

  if (isFetchingStatistics) {
    return (
      <div className={styles.statsWrapper}>
        <CircleLoader />
      </div>
    );
  }
  if (!statisticsResponse || !species) {
    return null;
  }

  const { genome_stats: rawGenomeStats } = statisticsResponse;

  const genomeStats = prepareSpeciesStats({
    statistics: rawGenomeStats,
    genomeIdForUrl: genomeIdForUrl,
    exampleFocusObjects: exampleObjects ?? []
  });

  const onSectionToggle = (
    section: SpeciesStatsSection,
    isExpanded: boolean
  ) => {
    if (isExpanded) {
      species && trackSpeciesStatsSectionOpen(species, section);
      dispatch(setActiveGenomeExpandedSections([...expandedSections, section]));
    } else {
      dispatch(
        setActiveGenomeExpandedSections(
          expandedSections.filter((s) => s !== section)
        )
      );
    }
  };

  return (
    <div className={styles.statsWrapper}>
      {genomeStats.map((statsSection, key) => {
        const contentProps = {
          statsSection,
          species: species as CommittedItem,
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

export default SpeciesMainViewStats;
