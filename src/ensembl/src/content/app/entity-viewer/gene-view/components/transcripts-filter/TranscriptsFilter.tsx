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
import { Pick2 } from 'ts-multipick';

import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';
import { getEntityViewerActiveEntityId } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import {
  getFilters,
  getSortingRule
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSelectors';
import {
  setFilters,
  setSortingRule,
  Filter,
  Filters,
  SortingRule
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

import RadioGroup, {
  RadioOptions
} from 'src/shared/components/radio-group/RadioGroup';

import Checkbox from 'src/shared/components/checkbox/Checkbox';

import CloseButton from 'src/shared/components/close-button/CloseButton';

import { FullTranscript } from 'src/shared/types/thoas/transcript';

import styles from './TranscriptsFilter.scss';

type Transcript = Pick2<
  FullTranscript,
  'metadata',
  'biotype' | 'tsl' | 'appris'
>;

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

export const metadataFields = ['biotype', 'appris', 'tsl'] as const;

const createFilter = (metadataType: Filter['type'], label: string) => ({
  label,
  selected: false,
  type: metadataType
});

const createInitialFilters = (transcripts: Props['transcripts']) => {
  const initialFilters: Filters = {};
  for (const transcript of transcripts) {
    metadataFields.forEach((key) => {
      const metadataItem = transcript.metadata[key];
      if (metadataItem) {
        initialFilters[metadataItem.value as string] = createFilter(
          key,
          metadataItem.label
        );
      }
    });
  }
  return initialFilters;
};

const TranscriptsFilter = (props: Props) => {
  const filters = useSelector(getFilters);
  const sortingRule = useSelector(getSortingRule);
  const isSidebarOpen = useSelector(isEntityViewerSidebarOpen);
  const activeEntityId = useSelector(getEntityViewerActiveEntityId);

  const dispatch = useDispatch();

  const initialFilters: Filters = createInitialFilters(props.transcripts);

  // TODO: Add protein coding options in RadioOptions if there are protein coding biotype

  useEffect(() => {
    if (Object.keys(filters).length === 0) {
      dispatch(setFilters(initialFilters));
    }
  }, [activeEntityId]);

  const filterBoxClassnames = classNames(styles.filterBox, {
    [styles.filterBoxFullWidth]: !isSidebarOpen
  });

  const onSortingRuleChange = (value: OptionValue) => {
    dispatch(setSortingRule(value as SortingRule));
  };

  const onFilterChange = (
    filterName: string,
    filter: Filter,
    selected: boolean
  ) => {
    const updatedFilter = { ...filter, selected };
    const updatedFilters = {
      ...filters,
      [filterName]: updatedFilter
    };

    dispatch(setFilters(updatedFilters));
  };

  const filtersArray = Object.entries(filters);

  const filterColumns = metadataFields.map((fieldName) => {
    const filtersForColumn = filtersArray.filter(
      ([, filter]) => filter.type === fieldName
    );
    filtersForColumn.sort(sortFilters);

    const checkboxes = filtersForColumn.map(([key, filter]) => (
      <Checkbox
        key={key}
        classNames={{
          unchecked: styles.checkboxUnchecked,
          checked: styles.checkboxChecked
        }}
        labelClassName={styles.label}
        checked={filter.selected}
        label={filter.label}
        onChange={(selected) => onFilterChange(key, filter, selected)}
      />
    ));

    return <div key={fieldName}>{checkboxes}</div>;
  });

  return (
    <div className={styles.container}>
      <div className={filterBoxClassnames}>
        <div className={styles.sortContainer}>
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
          <div className={styles.filterContent}>{filterColumns}</div>
        </div>
        <CloseButton onClick={props.toggleFilter} />
      </div>
    </div>
  );
};

const sortFilters = (a: [string, Filter], b: [string, Filter]) => {
  if (a[0] === 'protein_coding') {
    return -1;
  } else if (b[0] === 'protein_coding') {
    return 1;
  } else {
    return a[1].label.localeCompare(b[1].label);
  }
};

export default TranscriptsFilter;
