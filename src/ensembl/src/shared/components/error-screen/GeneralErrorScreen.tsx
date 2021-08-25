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

import storageService from 'ensemblRoot/src/services/storage-service';

import React, { useState } from 'react';
import { replace } from 'connected-react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { Topbar } from 'src/header/Header';

import { ReactComponent as InfoIcon } from 'static/img/shared/icon_alert_circle.svg';
import { PrimaryButton } from '../button/Button';
import Chevron from '../chevron/Chevron';

import styles from './ErrorScreen.scss';
import { useDispatch } from 'react-redux';

const GeneralErrorScreen = () => {
  const dispatch = useDispatch();

  const [moreOptionExpanded, setMoreOptionExpanded] = useState(false);

  const toggleChevron = () => {
    setMoreOptionExpanded(!moreOptionExpanded);
  };

  const chevronDirection = () => {
    return moreOptionExpanded ? 'up' : 'down';
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const resetPage = () => {
    storageService.clearAll();
    dispatch(replace(urlFor.home()));
    reloadPage();
  };

  return (
    <section className={styles.generalErrorScreen}>
      <Topbar />
      <div className={styles.generalErrorBody}>
        <p className={styles.generalErrorTopMessage}>
          Venn of the current issue
        </p>
        <div className={styles.generalErrorImage}>
          <div className={styles.vennCircle1}>
            <span>We've made some changes...</span>
          </div>
          <div className={styles.vennCircle2}>
            <div className={styles.infoIcon}>
              <InfoIcon />
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
            <a onClick={toggleChevron}>If the site still fails to load</a>
            <Chevron
              direction={chevronDirection()}
              animate={true}
              onClick={toggleChevron}
            ></Chevron>
          </div>
          {moreOptionExpanded && (
            <div className={styles.resetOption}>
              <div>Unfortunately we need to reset everything</div>
              <div>
                All your species, configuration if views &amp; history will be
                lost
              </div>
              <PrimaryButton isDisabled={false} onClick={resetPage}>
                Reset the site
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GeneralErrorScreen;
