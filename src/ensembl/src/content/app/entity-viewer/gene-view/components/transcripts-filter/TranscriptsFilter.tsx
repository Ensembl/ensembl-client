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
import classNames from 'classnames';
import { connect } from 'react-redux';

import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';
import {
  getFilters,
  getSortingRule
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSelectors';
import {
  setFilters,
  Filters,
  setSortingRule,
  SortingRule
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

import RadioGroup, {
  RadioOptions
} from 'src/shared/components/radio-group/RadioGroup';

import Checkbox from 'src/shared/components/checkbox/Checkbox';

import { ReactComponent as CloseIcon } from 'static/img/shared/close.svg';
import { ReactComponent as ChevronUp } from 'static/img/shared/chevron-up.svg';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { RootState } from 'src/store';

import styles from './TranscriptsFilter.scss';

type Props = {
  filters: Filters;
  sortingRule: SortingRule;
  toggleFilter: () => void;
  isSidebarOpen: boolean;
  transcripts: Transcript[];
  setFilters: (filters: Filters) => void;
  setSortingRule: (sortingRule: SortingRule) => void;
};

type OptionValue = string | number | boolean;

const sortingOrderToLabel = [
  [SortingRule.DEFAULT, 'Default'],
  [
    SortingRule.SPLICED_LENGTH_LONGEST_TO_SHORTEST,
    'Spliced length: longest – shortest'
  ],
  [
    SortingRule.SPLICED_LENGTH_SHORTEST_TO_LONGEST,
    'Spliced length: shortest – longest'
  ]
];

const radioData: RadioOptions = sortingOrderToLabel.map(([key, value]) => ({
  value: key,
  label: value
}));

const TranscriptsFilter = (props: Props) => {
  const biotypes = props.transcripts
    .map((a) => a.so_term)
    .filter(Boolean) as string[];

  const uniqueBiotypes = Array.from(new Set(biotypes));

  // TODO: Add protein coding options in RadioOptions if there are protein coding biotype
  const initialFilters = uniqueBiotypes.reduce((accumulator, biotype): {
    [filter: string]: boolean;
  } => {
    return {
      ...accumulator,
      [biotype]: false
    };
  }, {});

  useEffect(() => {
    if (Object.keys(props.filters).length === 0) {
      props.setFilters(initialFilters);
    }
  }, []);

  const filterBoxClassnames = classNames(styles.filterBox, {
    [styles.filterBoxFullWidth]: !props.isSidebarOpen
  });

  const onSortingRuleChange = (value: OptionValue) => {
    props.setSortingRule(value as SortingRule);
  };

  const onFilterChange = (filterName: string, isChecked: boolean) => {
    const updatedFilters = {
      ...props.filters,
      [filterName]: isChecked
    };

    props.setFilters(updatedFilters);
  };

  const checkboxes = Object.entries(props.filters).map(([key, value]) => (
    <Checkbox
      key={key}
      classNames={{
        unchecked: styles.checkboxUnchecked,
        checked: styles.checkboxChecked
      }}
      labelClassName={styles.label}
      checked={value}
      label={key}
      onChange={(isChecked) => onFilterChange(key, isChecked)}
    />
  ));

  return (
    <div className={styles.container}>
      <div className={styles.filterLabel} onClick={props.toggleFilter}>
        Filter & sort
        <ChevronUp className={styles.chevron} />
      </div>
      <div className={filterBoxClassnames}>
        <div className={styles.sort}>
          <div className={styles.header}>Sort by</div>
          <div className={styles.sortContent}>
            <RadioGroup
              classNames={{
                label: styles.label,
                radio: styles.radio,
                radioChecked: styles.radioChecked,
                wrapper: styles.buttonWrapper
              }}
              options={radioData}
              onChange={onSortingRuleChange}
              selectedOption={props.sortingRule}
            />
          </div>
        </div>
        <div className={styles.filter}>
          <div className={styles.header}>Filter by</div>
          <div className={styles.filterContent}>
            <div className={styles.filterColumn}>{checkboxes}</div>
          </div>
        </div>
        <CloseIcon className={styles.closeIcon} onClick={props.toggleFilter} />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  filters: getFilters(state),
  sortingRule: getSortingRule(state),
  isSidebarOpen: isEntityViewerSidebarOpen(state)
});

const mapDispatchToProps = {
  setFilters,
  setSortingRule
};

export default connect(mapStateToProps, mapDispatchToProps)(TranscriptsFilter);
