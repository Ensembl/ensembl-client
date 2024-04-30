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

import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';

import PillButton from 'src/shared/components/pill-button/PillButton';
import CloseButton from 'src/shared/components/close-button/CloseButton';

import styles from './TrackPanelItem.module.css';

type Props = {
  count: number;
  itemName: string;
  isExpanded: boolean;
  toggleExpand: () => void;
};

const TrackPanelItemsExpandLozenge = (props: Props) => {
  const { count, itemName, isExpanded, toggleExpand } = props;

  if (count < 1) {
    // should never happen; but this component doesn't know it
    return null;
  }

  if (isExpanded) {
    return (
      <div className={styles.itemsExpandLozenge}>
        <CloseButton onClick={toggleExpand} />
      </div>
    );
  }

  return (
    <div className={styles.itemsExpandLozenge}>
      <PillButton onClick={toggleExpand}>+{count}</PillButton>
      <span className={styles.labelTextSecondary}>
        {pluralise(itemName, count)}
      </span>
    </div>
  );
};

export default TrackPanelItemsExpandLozenge;
