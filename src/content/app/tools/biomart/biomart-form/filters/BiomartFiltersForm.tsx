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

import { useAppDispatch, useAppSelector } from 'src/store';
import { filterData } from 'src/content/app/tools/biomart/state/biomartSelectors';
import {
  BiomartFilterKey,
  setFilterData
} from 'src/content/app/tools/biomart/state/biomartSlice';

import BiomartRegionPanel from 'src/content/app/tools/biomart/biomart-form/filters/panels/region/BiomartRegionPanel';
import BiomartGenePanel from 'src/content/app/tools/biomart/biomart-form/filters/panels/gene/BiomartGenePanel';

const BiomartFiltersForm = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(filterData);

  const toggleSection = (section: BiomartFilterKey) => {
    if (!data) {
      return;
    }

    const newData = {
      ...data,
      [section]: {
        ...data[section],
        expanded: !data[section].expanded
      }
    };

    dispatch(setFilterData(newData));
  };

  return (
    <div>
      {data && data.region && (
        <BiomartRegionPanel toggle={() => toggleSection('region')} />
      )}
      {data && data.gene && (
        <BiomartGenePanel toggle={() => toggleSection('gene')} />
      )}
    </div>
  );
};

export default BiomartFiltersForm;
