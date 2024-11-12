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

import styles from './BiomartForm.module.css';
import BiomartColumnsHeader from './columns/BiomartColumnsHeader';
import BiomartFiltersHeader from './filters/BiomartFiltersHeader';
import useMediaQuery from 'src/shared/hooks/useMediaQuery';
import classNames from 'classnames';
import { SecondaryButton } from 'src/shared/components/button/Button';
import { useAppDispatch, useAppSelector } from 'src/store';
import {
  setColumnSelectionData,
  setFilterData,
  setTab
} from '../state/biomartSlice';
import { useEffect } from 'react';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import {
  useBiomartColumnSelectionQuery,
  useBiomartFiltersQuery
} from '../state/biomartApiSlice';
import { columnSelectionData, filterData } from '../state/biomartSelectors';
import ShadedInput from 'src/shared/components/input/ShadedInput';

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

const BiomartColumnsForm = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(columnSelectionData);

  const toggleSection = (index: number) => {
    if (!data) {
      return;
    }
    const newData = data.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          expanded: !item.expanded
        };
      }
      return item;
    });

    dispatch(setColumnSelectionData(newData));
  };

  const onCheckboxChange = (sectionIndex: number, optionIndex: number) => {
    if (!data) {
      return;
    }
    const newData = data.map((item, i) => {
      if (i === sectionIndex) {
        return {
          ...item,
          options: item.options.map((option, j) => {
            if (j === optionIndex) {
              return {
                ...option,
                checked: !option.checked
              };
            }
            return option;
          })
        };
      }
      return item;
    });

    dispatch(setColumnSelectionData(newData));
  };

  return (
    <div>
      {data &&
        data.map((item, i) => {
          return (
            <div key={`${item}${i}`} className={styles.sectionContainer}>
              <div className={styles.sectionTitleContainer}>
                <ShowHide
                  label={item.label}
                  isExpanded={item.expanded}
                  onClick={() => toggleSection(i)}
                />
              </div>
              {item.expanded && (
                <div className={styles.sectionSelectionContainer}>
                  {item.options.map((option, j) => {
                    return (
                      <Checkbox
                        key={j}
                        label={option.label}
                        checked={option.checked || false}
                        onChange={() => onCheckboxChange(i, j)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

const BiomartFiltersForm = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(filterData);

  const toggleSection = (section: string) => {
    if (!data) {
      return;
    }

    switch (section) {
      case 'region': {
        const newData = {
          ...data,
          region: {
            ...data.region,
            expanded: !data.region.expanded
          }
        };

        dispatch(setFilterData(newData));
        break;
      }
      case 'gene': {
        const newData = {
          ...data,
          gene: {
            ...data.gene,
            expanded: !data.gene.expanded
          }
        };

        dispatch(setFilterData(newData));
        break;
      }
      default:
        break;
    }
  };

  const toggleSectionFilter = (section: string, filter: string) => {
    if (!data) {
      return;
    }

    if (section === 'region') {
      let newData;
      if (filter === 'chromosomes') {
        newData = {
          ...data,
          region: {
            ...data.region,
            chromosomes: {
              ...data.region.chromosomes,
              expanded: !data.region.chromosomes.expanded
            }
          }
        };
      } else if (filter === 'coordinates') {
        newData = {
          ...data,
          region: {
            ...data.region,
            coordinates: {
              ...data.region.coordinates,
              expanded: !data.region.coordinates.expanded
            }
          }
        };
      } else {
        return;
      }

      dispatch(setFilterData(newData));
    }

    if (section === 'gene') {
      let newData;
      if (filter === 'gene_types') {
        newData = {
          ...data,
          gene: {
            ...data.gene,
            gene_types: {
              ...data.gene.gene_types,
              expanded: !data.gene.gene_types.expanded
            }
          }
        };
      } else if (filter === 'transcript_types') {
        newData = {
          ...data,
          gene: {
            ...data.gene,
            transcript_types: {
              ...data.gene.transcript_types,
              expanded: !data.gene.transcript_types.expanded
            }
          }
        };
      } else if (filter === 'gene_sources') {
        newData = {
          ...data,
          gene: {
            ...data.gene,
            gene_sources: {
              ...data.gene.gene_sources,
              expanded: !data.gene.gene_sources.expanded
            }
          }
        };
      } else if (filter === 'transcript_sources') {
        newData = {
          ...data,
          gene: {
            ...data.gene,
            transcript_sources: {
              ...data.gene.transcript_sources,
              expanded: !data.gene.transcript_sources.expanded
            }
          }
        };
      } else {
        return;
      }

      dispatch(setFilterData(newData));
    }
  };

  return (
    <div>
      {data && data.region && (
        <div className={styles.sectionContainer}>
          <div className={styles.sectionTitleContainer}>
            <ShowHide
              label={'Region'}
              isExpanded={data.region.expanded}
              onClick={() => toggleSection('region')}
            />
          </div>
          {data.region.expanded && (
            <div>
              <div className={styles.sectionFilterContainer}>
                <div className={styles.sectionTitleContainer}>
                  <ShowHide
                    label={'Chromosome'}
                    isExpanded={data.region?.chromosomes?.expanded || false}
                    onClick={() => toggleSectionFilter('region', 'chromosomes')}
                  />
                </div>
                {data.region?.chromosomes?.expanded && (
                  <div className={styles.sectionSelectionContainer}>
                    {data.region?.chromosomes?.input?.map((val, i) => {
                      return (
                        <Checkbox
                          key={i}
                          label={val}
                          checked={false}
                          onChange={() => {}}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              <div className={styles.sectionFilterContainer}>
                <div className={styles.sectionTitleContainer}>
                  <ShowHide
                    label={'Coordinates'}
                    isExpanded={data.region?.coordinates?.expanded || false}
                    onClick={() => toggleSectionFilter('region', 'coordinates')}
                  />
                </div>
                {data.region?.coordinates?.expanded && (
                  <div className={styles.sectionSelectionContainer}>
                    <div className={styles.biomartInput}>
                      <label>
                        <span>Start</span>
                        <ShadedInput
                          value={data.region?.coordinates?.input[0] || ''}
                          onChange={() => {}}
                          placeholder="Start"
                        />
                      </label>
                    </div>
                    <div className={styles.biomartInput}>
                      <label>
                        <span>End</span>
                        <ShadedInput
                          value={data.region?.coordinates?.input[1] || ''}
                          onChange={() => {}}
                          placeholder="End"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {data && data.gene && (
        <div className={styles.sectionContainer}>
          <div className={styles.sectionTitleContainer}>
            <ShowHide
              label={'Gene'}
              isExpanded={data.gene.expanded || false}
              onClick={() => toggleSection('gene')}
            />
          </div>
          {data.gene.expanded && (
            <div>
              <div className={styles.sectionFilterContainer}>
                <div className={styles.sectionTitleContainer}>
                  <ShowHide
                    label={'Gene types'}
                    isExpanded={data.gene?.gene_types?.expanded || false}
                    onClick={() => toggleSectionFilter('gene', 'gene_types')}
                  />
                </div>
                {data.gene?.gene_types?.expanded && (
                  <div className={styles.sectionSelectionContainer}>
                    {data.gene?.gene_types?.input?.map((val, i) => {
                      return (
                        <Checkbox
                          key={i}
                          label={val}
                          checked={false}
                          onChange={() => {}}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              <div className={styles.sectionFilterContainer}>
                <div className={styles.sectionTitleContainer}>
                  <ShowHide
                    label={'Transcript types'}
                    isExpanded={data.gene?.transcript_types?.expanded || false}
                    onClick={() =>
                      toggleSectionFilter('gene', 'transcript_types')
                    }
                  />
                </div>
                {data.gene?.transcript_types?.expanded && (
                  <div className={styles.sectionSelectionContainer}>
                    {data.gene?.transcript_types?.input?.map((val, i) => {
                      return (
                        <Checkbox
                          key={i}
                          label={val}
                          checked={false}
                          onChange={() => {}}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              <div className={styles.sectionFilterContainer}>
                <div className={styles.sectionTitleContainer}>
                  <ShowHide
                    label={'Gene sources'}
                    isExpanded={data.gene?.gene_sources?.expanded || false}
                    onClick={() => toggleSectionFilter('gene', 'gene_sources')}
                  />
                </div>
                {data.gene?.gene_sources?.expanded && (
                  <div className={styles.sectionSelectionContainer}>
                    {data.gene?.gene_sources?.input?.map((val, i) => {
                      return (
                        <Checkbox
                          key={i}
                          label={val}
                          checked={false}
                          onChange={() => {}}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              <div className={styles.sectionFilterContainer}>
                <div className={styles.sectionTitleContainer}>
                  <ShowHide
                    label={'Transcript sources'}
                    isExpanded={
                      data.gene?.transcript_sources?.expanded || false
                    }
                    onClick={() =>
                      toggleSectionFilter('gene', 'transcript_sources')
                    }
                  />
                </div>
                {data.gene?.transcript_sources?.expanded && (
                  <div className={styles.sectionSelectionContainer}>
                    {data.gene?.transcript_sources?.input?.map((val, i) => {
                      return (
                        <Checkbox
                          key={i}
                          label={val}
                          checked={false}
                          onChange={() => {}}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BiomartForm;
