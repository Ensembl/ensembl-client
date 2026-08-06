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

import { useNavigate } from 'react-router';

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import SpeciesManagerIndicator from 'src/shared/components/species-manager-indicator/SpeciesManagerIndicator';
import { HelpPopupButton } from 'src/shared/components/help-popup';
import { SelectedGenomes } from 'src/content/app/species-selector/components/species-selector-app-bar/SpeciesSelectorAppBar';

export const SpeciesManagerAppBar = () => {
  const navigate = useNavigate();

  const onClose = () => navigate(-1);

  const mainContent = <SelectedGenomes />;

  const appName = <AppName>Genome selector</AppName>;

  return (
    <AppBar
      topLeft={appName}
      topRight={<SpeciesManagerIndicator mode="close" onClose={onClose} />}
      mainContent={mainContent}
      aside={<HelpPopupButton slug="genome-selector-intro" />}
    />
  );
};

export default SpeciesManagerAppBar;
