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
import classNames from 'classnames';

// import { Topbar } from 'src/header/Header';
import SupportedWebBrowser from './components/supported-web-browser/SupportedWebBrowser';

import { ReactComponent as InfoIcon } from 'static/img/shared/icon_alert_circle.svg';

import styles from './UnsupportedBrowser.scss';
import errorStyles from 'src/shared/components/error-screen/ErrorScreen.scss';

const UnsupportedBrowser = () => {
  return (
    <div className={styles.container}>
      <section className={styles.section1}>
        <Diagram />
      </section>
      <section className={styles.section2}>
        <div className={styles.supportMessage}>
          We support the latest versions of these browsers
        </div>
        <SupportedBrowsers />
      </section>
      <section className={styles.section3}>
        If you think you’re seeing this message in error, please contact us
      </section>
    </div>
  );
};

const Diagram = () => {
  return (
    <>
      <div className={styles.diagramTitle}>Venn of the unsupported browser</div>
      <div className={errorStyles.generalErrorImage}>
        <div
          className={classNames(
            errorStyles.vennCircle,
            errorStyles.vennCircleLeft
          )}
        >
          <span> We may not support this browser...</span>
        </div>
        <div
          className={classNames(
            errorStyles.vennCircle,
            errorStyles.vennCircleRight
          )}
        >
          <div className={errorStyles.vennIntersection}>
            <div className={errorStyles.infoIcon}>
              <InfoIcon />
            </div>
          </div>
          <span>...you may need to update or change your browser</span>
        </div>
      </div>
    </>
  );
};

const SupportedBrowsers = () => {
  const browserNames = ['chrome', 'edge', 'firefox', 'safari'] as const;

  return (
    <div className={styles.supportedBrowsers}>
      {browserNames.map((browserName) => (
        <SupportedWebBrowser name={browserName} key={browserName} />
      ))}
    </div>
  );
};

export default UnsupportedBrowser;
