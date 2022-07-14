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

import styles from './RowsPerPageSelector.scss';
/*
    - XD: https://xd.adobe.com/view/78773ed6-d738-4ea6-be84-fcc73487eac4-2d24/screen/65cb206c-02a5-45de-865f-a7ddea257853?fullscreen
    - Displays the dropdown to change the number of rows displayed in a page
*/

const RowsPerPageSelector = () => {
  return (
    <div className={styles.rowsPerPageSelector}>Rows per page selector</div>
  );
};

export default RowsPerPageSelector;
