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

import styles from '../first-visit-notification/FirstVisitNotification.module.css';

/**
 * This is a hard-coded notification about Ensembl tools going down.
 */

const ToolsDownNotification = () => {
  return (
    <>
      <p className={styles.strong}>Ensembl tools availability</p>

      <p>
        Please be advised that because of scheduled infrastructure maintenance,
        the BLAST and VEP tools on the Ensembl website will be unavailable from
        8:00 AM on November 3 until the afternoon of November 5.
      </p>

      <p>We apologise for the inconvenience.</p>
    </>
  );
};

export default ToolsDownNotification;
