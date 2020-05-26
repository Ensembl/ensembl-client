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

import styles from './HomepageSiteInfo.scss';

const HomepageSiteInfo = () => (
  <section className={styles.siteMessage}>
    <h4>Using the site</h4>
    <p>
      A very limited data set has been made available for this first release.
    </p>
    <p>Blue icons and text are clickable and will usually 'do' something.</p>
    <p>
      Grey icons indicate apps &amp; functionality that is planned, but not
      available yet.
    </p>
    <p className={styles.convoMessage}>
      It's very early days, but why not join the conversation:
    </p>
    <p>
      <a href="mailto:helpdesk@ensembl.org">helpdesk@ensembl.org</a>
    </p>
  </section>
);

export default HomepageSiteInfo;
