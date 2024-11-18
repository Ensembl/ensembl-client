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
import BiomartMultiSelectFilter from 'src/content/app/tools/biomart/biomart-form/filters/panels/BiomartMultiSelectFilter';

import { useAppDispatch, useAppSelector } from 'src/store';
import { filterData } from 'src/content/app/tools/biomart/state/biomartSelectors';
import {
  BiomartGeneFilters,
  setFilterData
} from 'src/content/app/tools/biomart/state/biomartSlice';

import styles from '../../../BiomartForm.module.css';

type BiomartGenePanelProps = {
  toggle: () => void;
};

const BiomartGenePanel = (props: BiomartGenePanelProps) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(filterData);

  const toggleGeneSection = (filter: BiomartGeneFilters) => {
    if (!data) {
      return;
    }

    const newData = {
      ...data,
      gene: {
        ...data.gene,
        [filter]: {
          ...data.gene[filter],
          expanded: !data.gene[filter].expanded
        }
      }
    };

    dispatch(setFilterData(newData));
  };

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionTitleContainer}>
        <ShowHide
          label={'Gene'}
          isExpanded={data.gene.expanded || false}
          onClick={props.toggle}
        />
      </div>
      {data.gene.expanded && (
        <div>
          <BiomartMultiSelectFilter
            data={data.gene?.gene_types}
            toggle={() => toggleGeneSection('gene_types')}
            label={'Gene types'}
          />
          <BiomartMultiSelectFilter
            data={data.gene?.transcript_types}
            toggle={() => toggleGeneSection('transcript_types')}
            label={'Transcript types'}
          />
          <BiomartMultiSelectFilter
            data={data.gene?.gene_sources}
            toggle={() => toggleGeneSection('gene_sources')}
            label={'Gene sources'}
          />
          <BiomartMultiSelectFilter
            data={data.gene?.transcript_sources}
            toggle={() => toggleGeneSection('transcript_sources')}
            label={'Transcript sources'}
          />
        </div>
      )}
    </div>
  );
};

export default BiomartGenePanel;
