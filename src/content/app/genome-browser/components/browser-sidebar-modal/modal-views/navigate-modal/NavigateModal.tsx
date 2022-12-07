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

import React, { useState } from 'react';

import RegionForm from './RegionForm';
import NewLocationForm from './NewLocationForm';

import styles from './NavigateModal.scss';

export enum NavigateModalContent {
  REGION_FORM,
  NEW_LOCATION_FORM
}

export const NavigateModal = () => {
  const [view, changeView] = useState(NavigateModalContent.REGION_FORM);

  return (
    <div className={styles.navigateModal}>
      {view === NavigateModalContent.REGION_FORM ? (
        <RegionForm changeView={changeView} />
      ) : (
        <NewLocationForm changeView={changeView} />
      )}
    </div>
  );
};

export default NavigateModal;
