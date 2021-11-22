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

import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';

import SimpleTrackPanelItemLayout from './track-panel-item-layout/SimpleTrackPanelItemLayout';

import styles from './TrackPanelItem.scss';

type Props = {
  count: number;
  itemName: string;
};

const TrackPanelItemsCount = (props: Props) => {
  const { count, itemName } = props;

  if (count < 1) {
    // should never happen; but this component doesn't know it
    return null;
  }

  const countClassName = classNames(styles.labelTextStrong, styles.itemsCount);

  return (
    <SimpleTrackPanelItemLayout>
      <div className={styles.label}>
        <span className={countClassName}>+ {count}</span>
        <span className={styles.labelTextSecondary}>
          {pluralise(itemName, count)}
        </span>
      </div>
    </SimpleTrackPanelItemLayout>
  );
};

export default TrackPanelItemsCount;
