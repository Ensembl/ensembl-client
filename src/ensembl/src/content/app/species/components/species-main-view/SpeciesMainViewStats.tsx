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

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import SpeciesStats from 'src/content/app/species/components/species-stats/SpeciesStats';
import {
  getActiveGenomeId,
  getActiveGenomeStats
} from 'src/content/app/species/state/general/speciesGeneralSelectors';
import {
  fetchStatsForActiveGenome,
  sectionGroupsMap
} from 'src/content/app/species/state/general/speciesGeneralSlice';
import ExpandableSection from 'src/shared/components/expandable-section/ExpandableSection';

import { RootState } from 'src/store';
import {
  GenomeStats,
  StatsSection
} from '../../state/general/speciesGeneralSlice';

import styles from './SpeciesMainView.scss';

type Props = {
  activeGenomeId: string | null;
  genomeStats: GenomeStats | undefined;
  fetchStatsForActiveGenome: () => void;
};

const getCollapsedContent = (statsSection: StatsSection) => {
  const { primaryStats, secondaryStats, section } = statsSection;

  const { title, exampleLink } = sectionGroupsMap[section];

  return (
    <div className={styles.collapsedContent}>
      <span className={styles.title}>{title}</span>
      {primaryStats && (
        <div className={styles.primary}>
          <span className={styles.primaryValue}>
            {primaryStats.primaryValue}
          </span>
          <span className={styles.primaryUnit}>{primaryStats.primaryUnit}</span>
        </div>
      )}

      {secondaryStats && (
        <div className={styles.secondary}>
          <span className={styles.secondaryValue}>
            {secondaryStats.secondaryValue}
          </span>
          <span className={styles.secondaryUnit}>
            {secondaryStats.secondaryUnit}
          </span>
        </div>
      )}

      {exampleLink && <span className={styles.exampleLink}>{exampleLink}</span>}
    </div>
  );
};

const getExpandedContent = (statsSection: StatsSection) => {
  const { groups, section } = statsSection;
  const { exampleLink } = sectionGroupsMap[section];

  return groups.map((group, group_index) => {
    const { title, stats } = group;

    const primaryStatsClassName = classNames(styles.primaryStats, {
      [styles.primaryStatsNoLink]: !exampleLink
    });
    const primaryOrSecondaryClassName =
      group_index === 0 ? primaryStatsClassName : styles.secondaryStats;

    return (
      <div key={group_index} className={styles.expandedContent}>
        <div className={primaryOrSecondaryClassName}>
          <span className={styles.title}>{title}</span>
          <div className={styles.stats}>
            {stats.map((stat, stat_index) => {
              return <SpeciesStats key={stat_index} {...stat} />;
            })}
            {exampleLink && (
              <span className={styles.exampleLink}>{exampleLink}</span>
            )}
          </div>
        </div>
      </div>
    );
  });
};

const SpeciesMainViewStats = (props: Props) => {
  useEffect(() => {
    if (!props.genomeStats) {
      props.fetchStatsForActiveGenome();
    }
  }, [props.genomeStats, props.activeGenomeId]);

  if (!props.genomeStats) {
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
  return {
    activeGenomeId: getActiveGenomeId(state),
    genomeStats: getActiveGenomeStats(state)
  };
};

const mapDispatchToProps = {
  fetchStatsForActiveGenome
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeciesMainViewStats);
