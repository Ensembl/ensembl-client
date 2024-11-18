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
import ToolsTopBar from 'src/content/app/tools/shared/components/tools-top-bar/ToolsTopBar';
import BiomartAppBar from 'src/content/app/tools/biomart/biomart-appbar/BiomartAppBar';
import BiomartSettings from 'src/content/app/tools/biomart/biomart-settings/BiomartSettings';
import { setSelectedSpecies } from 'src/content/app/tools/biomart/state/biomartSlice';
import { useAppDispatch, useAppSelector } from 'src/store';
import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';
import BiomartInterstitialInstructions from 'src/content/app/tools/biomart/interstitial/BiomartInterstitialInstructions';
import BiomartForm from 'src/content/app/tools/biomart/biomart-form/BiomartForm';

const Biomart = () => {
  const dispatch = useAppDispatch();
  const speciesList = useAppSelector(getEnabledCommittedSpecies);
  const selectedSpecies = useAppSelector(
    (state) => state.biomart.general.selectedSpecies
  );

  useEffect(() => {
    if (speciesList.length > 0) {
      dispatch(setSelectedSpecies(speciesList[0]));
    } else {
      dispatch(setSelectedSpecies(null));
    }
  }, []);

  return (
    <div>
      <BiomartAppBar />
      <ToolsTopBar>
        <BiomartSettings />
      </ToolsTopBar>
      {selectedSpecies ? <BiomartForm /> : <BiomartInterstitialInstructions />}
    </div>
  );
};

export default Biomart;
