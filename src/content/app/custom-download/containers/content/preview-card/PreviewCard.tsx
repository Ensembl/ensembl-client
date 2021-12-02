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
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import { formatResults } from './previewCardHelper';
import { getSelectedAttributes } from 'src/content/app/custom-download/state/attributes/attributesSelector';
import { getSelectedFilters } from 'src/content/app/custom-download/state/filters/filtersSelector';
import {
  getPreviewResult,
  getIsLoadingResult
} from 'src/content/app/custom-download/state/customDownloadSelectors';
import JSONValue from 'src/shared/types/JSON';

import styles from './PreviewCard.scss';

type Props = {
  selectedAttributes: JSONValue;
  selectedFilters: JSONValue;
  preview: JSONValue;
  isLoadingResult: boolean;
};

const PreviewCard = (props: Props) => {
  const formattedResults = formatResults(
    props.preview,
    props.selectedAttributes
  );
  const headerRow = formattedResults.shift() || [];
  const dataRow = formattedResults.shift() || [];

  if (!dataRow.length) {
    return (
      <div className={styles.loaderWrapper}>
        There is no data to display. Please select different filters to try
        again.
      </div>
    );
  }

  return (
    <table className={styles.resultCard}>
      <tbody>
        {headerRow.map((header: string, rowKey: number) => {
          return (
            <tr key={rowKey} className={styles.resultLine}>
              <td className={styles.lineHeader} title={header}>
                {header}
              </td>
              <td className={styles.lineValue}>
                {dataRow[rowKey] ? dataRow[rowKey] : '-'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const mapStateToProps = (state: RootState): Props => ({
  selectedAttributes: getSelectedAttributes(state),
  selectedFilters: getSelectedFilters(state),
  preview: getPreviewResult(state),
  isLoadingResult: getIsLoadingResult(state)
});

export default connect(mapStateToProps)(PreviewCard);
