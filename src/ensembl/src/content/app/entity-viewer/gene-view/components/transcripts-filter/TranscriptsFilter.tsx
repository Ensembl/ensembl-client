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
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';
import {
  getFilters,
  getSortingRule
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSelectors';
import {
  setFilters,
  setSortingRule,
  SortingRule
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

import RadioGroup, {
  RadioOptions
} from 'src/shared/components/radio-group/RadioGroup';

import Checkbox from 'src/shared/components/checkbox/Checkbox';

import CloseButton from 'src/shared/components/close-button/CloseButton';
import { ReactComponent as ChevronUp } from 'static/img/shared/chevron-up.svg';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import styles from './TranscriptsFilter.scss';

type Props = {
  transcripts: Transcript[];
  toggleFilter: () => void;
};

type OptionValue = string | number | boolean;

const sortingOrderToLabel = [
  [SortingRule.DEFAULT, 'Default'],
  [SortingRule.SPLICED_LENGTH_DESC, 'Combined exon length: longest – shortest'],
  [SortingRule.SPLICED_LENGTH_ASC, 'Combined exon length: shortest – longest'],
  [SortingRule.EXON_COUNT_DESC, 'Exon count: high - low'],
  [SortingRule.EXON_COUNT_ASC, 'Exon count: low - high']
];

const radioData: RadioOptions = sortingOrderToLabel.map(([key, value]) => ({
  value: key,
  label: value
}));

const TranscriptsFilter = (props: Props) => {
  const filters = useSelector(getFilters);
  const sortingRule = useSelector(getSortingRule);
  const isSidebarOpen = useSelector(isEntityViewerSidebarOpen);
  const dispatch = useDispatch();

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
    if (Object.keys(filters).length === 0) {
      dispatch(setFilters(initialFilters));
    }
  }, []);

  const filterBoxClassnames = classNames(styles.filterBox, {
    [styles.filterBoxFullWidth]: !isSidebarOpen
  });

  const onSortingRuleChange = (value: OptionValue) => {
    dispatch(setSortingRule(value as SortingRule));
  };

  const onFilterChange = (filterName: string, isChecked: boolean) => {
    const updatedFilters = {
      ...filters,
      [filterName]: isChecked
    };

    dispatch(setFilters(updatedFilters));
  };

  const checkboxes = Object.entries(filters).map(([key, value]) => (
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
              selectedOption={sortingRule}
            />
          </div>
        </div>
        <div className={styles.filter}>
          <div className={styles.header}>Filter by</div>
          <div className={styles.filterContent}>
            <div className={styles.filterColumn}>{checkboxes}</div>
          </div>
        </div>
        <CloseButton onClick={props.toggleFilter} />
      </div>
    </div>
  );
};

export default TranscriptsFilter;
