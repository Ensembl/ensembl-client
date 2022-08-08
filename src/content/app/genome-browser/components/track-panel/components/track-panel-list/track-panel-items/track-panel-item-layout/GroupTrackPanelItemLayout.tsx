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

/**
 * This layout arranges its content in a way similar to SimpleTrackPanelItemLayout,
 * with the following differences:
 * - It contains an indicator (chevron) for whether all group elements are visible.
 *   The chevron is always visible regardless of the width of the main content.
 * - Its eye icon can be in a "half-visible" state meaning that some elements of the group
 *   are visible, but others aren't.
 */

import React from 'react';

import SimpleTrackPanelItemLayout, {
  Props as SimpleTrackPanelItemLayoutProps
} from './SimpleTrackPanelItemLayout';
import Chevron from 'src/shared/components/chevron/Chevron';

import styles from './TrackPanelItemLayout.scss';

type Props = SimpleTrackPanelItemLayoutProps & {
  toggleExpand: () => void;
  isCollapsed: boolean;
};

const GroupTrackPanelItemLayout = (props: Props) => {
  const { children, isCollapsed, toggleExpand, ...otherProps } = props;

  return (
    <SimpleTrackPanelItemLayout {...otherProps}>
      <div className={styles.groupItemMain}>
        <div className={styles.groupItemContent}>{children}</div>
        <Chevron
          onClick={toggleExpand}
          direction={isCollapsed ? 'down' : 'up'}
          className={styles.chevron}
        />
      </div>
    </SimpleTrackPanelItemLayout>
  );
};

export default GroupTrackPanelItemLayout;
