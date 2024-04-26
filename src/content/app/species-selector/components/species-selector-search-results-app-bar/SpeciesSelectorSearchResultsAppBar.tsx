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

import { useNavigate } from 'react-router-dom';

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import { HelpPopupButton } from 'src/shared/components/help-popup';
import { CloseButtonWithLabel } from 'src/shared/components/close-button/CloseButton';

const SpeciesSearchResultsModalAppBar = () => {
  return (
    <AppBar
      topLeft={<AppName>Species Selector</AppName>}
      mainContent={<CloseModalView />}
      aside={<HelpPopupButton slug="species-selector-intro" />}
    />
  );
};

const CloseModalView = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <CloseButtonWithLabel
      label="Find a species"
      labelPosition="right"
      onClick={handleClick}
    />
  );
};

export default SpeciesSearchResultsModalAppBar;
