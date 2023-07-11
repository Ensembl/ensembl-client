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

import React from 'react';

import { useAppDispatch } from 'src/store';

import { setModalView } from 'src/content/app/new-species-selector/state/species-selector-ui-slice/speciesSelectorUISlice';

import AppBar from 'src/shared/components/app-bar/AppBar';
import { HelpPopupButton } from 'src/shared/components/help-popup';
import CloseButton from 'src/shared/components/close-button/CloseButton';

import styles from './SpeciesSelectorSearchResultsAppBar.scss';

const SpeciesSearchResultsModalAppBar = () => {
  return (
    <AppBar
      appName="Species Selector"
      mainContent={<CloseModalView />}
      aside={<HelpPopupButton slug="species-selector-intro" />}
    />
  );
};

const CloseModalView = () => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setModalView(null));
  };

  return (
    <div className={styles.container}>
      <div className={styles.close} onClick={handleClick}>
        <CloseButton />
        <span>Find a species</span>
      </div>
    </div>
  );
};

export default SpeciesSearchResultsModalAppBar;
