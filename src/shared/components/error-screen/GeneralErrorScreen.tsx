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
import classNames from 'classnames';

import storageService from 'src/services/storage-service';
import IndexedDB from 'src/services/indexeddb-service';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { Topbar } from 'src/header/Header';
import ShowHide from '../show-hide/ShowHide';
import { PrimaryButton } from '../button/Button';

import AlertButton from 'src/shared/components/alert-button/AlertButton';

import styles from './ErrorScreen.scss';

const GeneralErrorScreen = () => {
  const [moreOptionExpanded, setMoreOptionExpanded] = useState(false);

  const toggleChevron = () => {
    setMoreOptionExpanded(!moreOptionExpanded);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const resetSite = async () => {
    storageService.clearAll();
    await IndexedDB.clearDatabase();
    window.location.replace(urlFor.home());
  };

  return (
    <section className={styles.generalErrorScreen}>
      <Topbar />
      <div className={styles.generalErrorBody}>
        <p className={styles.generalErrorTopMessage}>
          Venn of the current issue
        </p>
        <div className={styles.generalErrorImage}>
          <div className={classNames(styles.vennCircle, styles.vennCircleLeft)}>
            <span> We've made some changes...</span>
          </div>
          <div
            className={classNames(styles.vennCircle, styles.vennCircleRight)}
          >
            <div className={styles.vennIntersection}>
              <AlertButton className={styles.infoIcon} />
            </div>
            <span>...now we need you to do something</span>
          </div>
        </div>
        <div className={styles.reloadButton}>
          <PrimaryButton isDisabled={moreOptionExpanded} onClick={reloadPage}>
            Reload
          </PrimaryButton>
        </div>
        <div className={styles.generalErrorBottomMessage}>
          <div className={styles.moreOptions}>
            <ShowHide
              onClick={toggleChevron}
              isExpanded={moreOptionExpanded}
              label="If the site still fails to load"
            />
          </div>
          {moreOptionExpanded && (
            <div className={styles.resetOption}>
              <div>Unfortunately we need to reset everything</div>
              <div>
                All your species, configuration of views &amp; history will be
                lost
              </div>
              <PrimaryButton onClick={resetSite}>Reset the site</PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GeneralErrorScreen;
