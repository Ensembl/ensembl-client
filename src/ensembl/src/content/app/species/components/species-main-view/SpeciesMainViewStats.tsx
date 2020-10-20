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

import ViewInAppPopup from 'src/shared/components/view-in-app-popup/ViewInAppPopup';
import SpeciesStats from 'src/content/app/species/components/species-stats/SpeciesStats';
import ExpandableSection from 'src/shared/components/expandable-section/ExpandableSection';
import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import {
  getActiveGenomeId,
  getActiveGenomeStats
} from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { getGenomeExampleFocusObjects } from 'src/shared/state/genome/genomeSelectors';
import { fetchStatsForActiveGenome } from 'src/content/app/species/state/general/speciesGeneralSlice';

import { RootState } from 'src/store';
import { ExampleFocusObject } from 'src/shared/state/genome/genomeTypes';
import { GenomeStats } from '../../state/general/speciesGeneralSlice';
import { urlObj } from 'src/shared/components/view-in-app/ViewInApp';
import {
  StatsSection,
  sectionGroupsMap
} from '../../state/general/speciesGeneralHelper';

import styles from './SpeciesMainView.scss';
import { Link } from 'react-router-dom';

type Props = {
  activeGenomeId: string | null;
  genomeStats: GenomeStats | undefined;
  exampleFocusObjects: ExampleFocusObject[];
  fetchStatsForActiveGenome: () => void;
};

type ExampleLinkPopupProps = {
  links: Partial<urlObj>;
  children: ReactNode;
};

const ExampleLinkWithPopup = (props: ExampleLinkPopupProps) => {
  const isProduction = isEnvironment([Environment.PRODUCTION]);

  if (isProduction) {
    const linkToGenomeBrowser = props.links?.genomeBrowser;

    return linkToGenomeBrowser ? (
      <div className={styles.exampleLink}>
        <Link to={linkToGenomeBrowser}>{props.children}</Link>
      </div>
    ) : null;
  }

  return (
    <div className={styles.exampleLink}>
      <ViewInAppPopup links={props.links}>
        <span className={styles.exampleLinkText}>{props.children}</span>
      </ViewInAppPopup>
    </div>
  );
};

const getCollapsedContent = (statsSection: StatsSection) => {
  const { summaryStats, section, exampleLinks } = statsSection;
  const { title, exampleLinkText } = sectionGroupsMap[section];

  return (
    <div className={styles.collapsedContent}>
      <span className={styles.title}>{title}</span>

      {summaryStats?.length &&
        summaryStats.map((summaryStat, index) => {
          return (
            <div className={styles.summaryStat} key={index}>
              <span className={styles.value}>{summaryStat.primaryValue}</span>
              <span className={styles.unit}>{summaryStat.primaryUnit}</span>
            </div>
          );
        })}

      {exampleLinks && (
        <ExampleLinkWithPopup links={exampleLinks}>
          {exampleLinkText}
        </ExampleLinkWithPopup>
      )}
    </div>
  );
};

const getExpandedContent = (statsSection: StatsSection) => {
  const { groups, exampleLinks, section } = statsSection;
  const { exampleLinkText } = sectionGroupsMap[section];

  return (
    <div className={styles.expandedContent}>
      {groups.map((group, group_index) => {
        const { title, stats } = group;
        return stats.map((groupStats, row_index) => {
          const statsGroupClassName = classNames(styles.statsGroup, {
            [styles.statsGroupWithExampleLink]:
              !group_index && !row_index && exampleLinkText
          });
          return (
            <div key={row_index} className={statsGroupClassName}>
              {row_index === 0 && <span className={styles.title}>{title}</span>}
              <div className={styles.stats}>
                {groupStats.map((stat, stat_index) => {
                  return <SpeciesStats key={stat_index} {...stat} />;
                })}
              </div>
              {group_index === 0 && row_index === 0 && exampleLinks && (
                <ExampleLinkWithPopup links={exampleLinks}>
                  {exampleLinkText}
                </ExampleLinkWithPopup>
              )}
            </div>
          );
        });
      })}
    </div>
  );
};

const SpeciesMainViewStats = (props: Props) => {
  useEffect(() => {
    if (!props.genomeStats && props.exampleFocusObjects?.length) {
      props.fetchStatsForActiveGenome();
    }
  }, [props.genomeStats, props.activeGenomeId, props.exampleFocusObjects]);

  if (!props.genomeStats || !props.exampleFocusObjects?.length) {
    return null;
  }

  return (
    <div className={styles.statsWrapper}>
      {props.genomeStats.map((section, key) => {
        return (
          <ExpandableSection
            key={key}
            collapsedContent={getCollapsedContent(section)}
            expandedContent={getExpandedContent(section)}
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
    exampleFocusObjects: activeGenomeId
      ? getGenomeExampleFocusObjects(state, activeGenomeId)
      : []
  };
};

const mapDispatchToProps = {
  fetchStatsForActiveGenome
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeciesMainViewStats);
