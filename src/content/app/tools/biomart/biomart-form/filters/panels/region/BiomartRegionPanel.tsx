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
            toggle={() => toggleRegionSection('chromosomes')}
            label={'Chromosome'}
          />
          <BiomartCoodinatesFilter
            data={data?.region?.coordinates}
            toggle={() => toggleRegionSection('coordinates')}
            label={'Coordinates'}
          />
        </div>
      )}
    </div>
  );
};

export default BiomartRegionPanel;
