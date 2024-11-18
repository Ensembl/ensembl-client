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

import { useEffect } from 'react';

import classNames from 'classnames';

import BiomartColumnsHeader from 'src/content/app/tools/biomart/biomart-form/columns/BiomartColumnsHeader';
import BiomartFiltersHeader from 'src/content/app/tools/biomart/biomart-form/filters/BiomartFiltersHeader';
import useMediaQuery from 'src/shared/hooks/useMediaQuery';
import { SecondaryButton } from 'src/shared/components/button/Button';
import { useAppDispatch, useAppSelector } from 'src/store';
import {
  setColumnSelectionData,
  setFilterData,
  setTab
} from 'src/content/app/tools/biomart/state/biomartSlice';
import {
  useBiomartColumnSelectionQuery,
  useBiomartFiltersQuery
} from 'src/content/app/tools/biomart/state/biomartApiSlice';
import BiomartColumnsForm from 'src/content/app/tools/biomart/biomart-form/columns/BiomartColumnsForm';
import BiomartFiltersForm from 'src/content/app/tools/biomart/biomart-form/filters/BiomartFiltersForm';

import styles from './BiomartForm.module.css';

// TODO: move to shared constants? copied from blast
const columnWidth = 860;
const columnGap = 45;
const leftPagePadding = 60;
const rightPagePadding = 30;
const smallViewportBreakpoint =
  columnWidth * 2 + columnGap + leftPagePadding + rightPagePadding;

const smallViewportMediaQuery = `(max-width: ${smallViewportBreakpoint - 1}px)`;

const BiomartForm = () => {
  const dispatch = useAppDispatch();
  const selectedSpecies = useAppSelector(
    (state) => state.biomart.general.selectedSpecies
  );
  const { data } = useBiomartColumnSelectionQuery({
    speciesId: selectedSpecies?.genome_id
  });
  const { data: filtersData } = useBiomartFiltersQuery({
    speciesId: selectedSpecies?.genome_id
  });
  const isSmallViewport = useMediaQuery(smallViewportMediaQuery);

  useEffect(() => {
    if (data) {
      dispatch(setColumnSelectionData(data));
    }
  }, [data]);

  useEffect(() => {
    if (filtersData) {
      dispatch(setFilterData(filtersData));
    }
  }, [filtersData]);

  if (isSmallViewport === null) {
    return null;
  }

  return <div>{isSmallViewport ? <MainSmall /> : <MainLarge />}</div>;
};

const MainLarge = () => {
  return (
    <div className={styles.grid}>
      <div>
        <BiomartColumnsHeader />
        <BiomartColumnsForm />
      </div>
      <div>
        <BiomartFiltersHeader />
        <BiomartFiltersForm />
      </div>
    </div>
  );
};

const MainSmall = () => {
  const tab = useAppSelector((state) => state.biomart.general.tab);

  return (
    <div className={styles.smallScreenGrid}>
      <BiomartFormTabToggle />
      {tab === 'tables' ? (
        <div>
          <BiomartColumnsHeader />
          <BiomartColumnsForm />
        </div>
      ) : (
        <div>
          <BiomartFiltersHeader />
          <BiomartFiltersForm />
        </div>
      )}
    </div>
  );
};

const BiomartFormTabToggle = () => {
  const dispatch = useAppDispatch();
  const tab = useAppSelector((state) => state.biomart.general.tab);

  const onSwitchToTables = () => {
    dispatch(setTab('tables'));
  };

  const onSwitchToFilters = () => {
    dispatch(setTab('filters'));
  };

  const tablesButtonClass = classNames(styles.biomartTabButton, {
    [styles.buttonActive]: tab === 'tables'
  });
  const filtersButtonClass = classNames(styles.biomartTabButton, {
    [styles.buttonActive]: tab === 'filters'
  });

  return (
    <div className={styles.biomartFormTabToggle}>
      <SecondaryButton className={tablesButtonClass} onClick={onSwitchToTables}>
        Data to download
      </SecondaryButton>
      <SecondaryButton
        className={filtersButtonClass}
        onClick={onSwitchToFilters}
      >
        Filters
      </SecondaryButton>
    </div>
  );
};

export default BiomartForm;
