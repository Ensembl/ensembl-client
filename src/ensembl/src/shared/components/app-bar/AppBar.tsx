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

import chevronRightIcon from 'static/img/shared/chevron-right-grey.svg';
import styles from './AppBar.scss';

type AppBarProps = {
  appName?: string;
  mainContent: React.ReactNode;
  aside?: React.ReactNode;
};

export const AppBar = (props: AppBarProps) => (
  <section className={styles.appBar}>
    <div className={styles.appBarTop}>{props.appName}</div>
    <div className={styles.appBarMain}>{props.mainContent}</div>
    <div className={styles.appBarAside}>{props.aside}</div>
  </section>
);

// this is a temporary component; will need update/refactoring once we have help resources
export const HelpAndDocumentation = () => {
  return (
    <div className={styles.helpLink}>
      <a className="inactive">
        Help &amp; documentation <img src={chevronRightIcon} alt="" />
      </a>
    </div>
  );
};

export default AppBar;
