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
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import SpeciesStats from 'src/content/app/species/components/species-stats/SpeciesStats';
import {
  getActiveGenomeId,
  getActiveGenomeStats
} from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { getGenomeExampleFocusObjects } from 'src/shared/state/genome/genomeSelectors';
import { fetchStatsForActiveGenome } from 'src/content/app/species/state/general/speciesGeneralSlice';
import ExpandableSection from 'src/shared/components/expandable-section/ExpandableSection';

import { RootState } from 'src/store';
import { GenomeStats } from '../../state/general/speciesGeneralSlice';

import {
  StatsSection,
  sectionGroupsMap
} from '../../state/general/speciesGeneralHelper';
import { ExampleFocusObject } from 'src/shared/state/genome/genomeTypes';

import styles from './SpeciesMainView.scss';

type Props = {
  activeGenomeId: string | null;
  genomeStats: GenomeStats | undefined;
  exampleFocusObjects: ExampleFocusObject[];
  fetchStatsForActiveGenome: () => void;
};

const getExampleLink = (exampleLink?: string, exampleLinkText?: string) => {
  if (!exampleLink) {
    return null;
  }

  return (
    <span className={styles.exampleLink}>
      <Link to={exampleLink}>{exampleLinkText}</Link>
    </span>
  );
};

const getCollapsedContent = (statsSection: StatsSection) => {
  const { primaryStats, secondaryStats, section, exampleLink } = statsSection;
  const { title, exampleLinkText } = sectionGroupsMap[section];

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

      {getExampleLink(exampleLink, exampleLinkText)}
    </div>
  );
};

const getExpandedContent = (statsSection: StatsSection) => {
  const { groups, exampleLink, section } = statsSection;
  const { exampleLinkText } = sectionGroupsMap[section];
  return (
    <div className={styles.expandedContent}>
      {groups.map((group, group_index: number) => {
        const { title, stats } = group;
        const primaryStatsClassName = classNames(styles.primaryStats, {
          [styles.primaryStatsNoLink]: !exampleLink
        });
        const primaryOrSecondaryClassName =
          group_index === 0 ? primaryStatsClassName : styles.secondaryStats;
        return (
          <div key={group_index} className={primaryOrSecondaryClassName}>
            <span className={styles.title}>{title}</span>
            <div className={styles.stats}>
              {stats.map((stat, stat_index: number) => {
                return <SpeciesStats key={stat_index} {...stat} />;
              })}
            </div>
            {group_index === 0 && getExampleLink(exampleLink, exampleLinkText)}
          </div>
        );
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
