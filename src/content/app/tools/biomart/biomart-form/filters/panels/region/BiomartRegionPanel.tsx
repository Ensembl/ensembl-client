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

import ShowHide from 'src/shared/components/show-hide/ShowHide';
import BiomartCoodinatesFilter from 'src/content/app/tools/biomart/biomart-form/filters/panels/region/BiomartCoordinatesFilter';
import BiomartMultiSelectFilter from 'src/content/app/tools/biomart/biomart-form/filters/panels/BiomartMultiSelectFilter';
import { useAppDispatch, useAppSelector } from 'src/store';
import { filterData } from 'src/content/app/tools/biomart/state/biomartSelectors';

import {
  BiomartRegionFilters,
  setFilterData
} from 'src/content/app/tools/biomart/state/biomartSlice';

import styles from '../../../BiomartForm.module.css';

type BiomartRegionPanelProps = {
  toggle: () => void;
};

const CHROMOSOMES = 'chromosomes';
const COORDINATES = 'coordinates';

const BiomartRegionPanel = (props: BiomartRegionPanelProps) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(filterData);

  const toggleRegionSection = (filter: BiomartRegionFilters) => {
    if (!data) {
      return;
    }

    const newData = {
      ...data,
      region: {
        ...data.region,
        [filter]: {
          ...data.region[filter],
          expanded: !data.region[filter].expanded
        }
      }
    };

    dispatch(setFilterData(newData));
  };

  // TODO - reuse for all multi select filters
  const handleSelect = (
    filter: BiomartRegionFilters,
    value: string,
    isChecked: boolean
  ) => {
    if (!data) {
      return;
    }

    let output = data.region[filter]?.output || [];
    if (isChecked) {
      output = output.filter((val) => val !== value) as string[];
    } else {
      output = [...output, value] as string[];
    }

    const newData = {
      ...data,
      region: {
        ...data.region,
        [filter]: {
          ...data.region[filter],
          output
        }
      }
    };

    dispatch(setFilterData(newData));
  };

  const onStartChange = (value: string) => {
    if (!data) {
      return;
    }

    let [, end] = data.region.coordinates.input;

    if (
      data.region.coordinates.output &&
      data.region.coordinates.output.length > 0
    ) {
      end = data.region.coordinates.output[1];
    }

    const newData = {
      ...data,
      region: {
        ...data.region,
        coordinates: {
          ...data.region.coordinates,
          output: [Number(value), end]
        }
      }
    };

    dispatch(setFilterData(newData));
  };

  const onEndChange = (value: string) => {
    if (!data) {
      return;
    }

    let [start] = data.region.coordinates.input;

    if (
      data.region.coordinates.output &&
      data.region.coordinates.output.length > 0
    ) {
      start = data.region.coordinates.output[0];
    }

    const newData = {
      ...data,
      region: {
        ...data.region,
        coordinates: {
          ...data.region.coordinates,
          output: [start, Number(value)]
        }
      }
    };

    dispatch(setFilterData(newData));
  };

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionTitleContainer}>
        <ShowHide
          label={'Region'}
          isExpanded={data.region.expanded}
          onClick={props.toggle}
        />
      </div>
      {data.region.expanded && (
        <div>
          <BiomartMultiSelectFilter
            data={data?.region?.chromosomes}
            toggle={() => toggleRegionSection(CHROMOSOMES)}
            label={'Chromosome'}
            handleSelect={(value, isChecked) =>
              handleSelect(CHROMOSOMES, value, isChecked)
            }
          />
          <BiomartCoodinatesFilter
            data={data?.region?.coordinates}
            toggle={() => toggleRegionSection(COORDINATES)}
            label={'Coordinates'}
            onStartChange={onStartChange}
            onEndChange={onEndChange}
          />
        </div>
      )}
    </div>
  );
};

export default BiomartRegionPanel;
