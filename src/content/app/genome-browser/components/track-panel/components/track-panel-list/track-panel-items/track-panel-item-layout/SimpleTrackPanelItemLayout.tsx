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
 * This layout ensures the correct arrangement of the following elements:
 *
 * - main content (occupies most of the space; does not wrap lines; shows an ellipsis when truncated)
 * - ellipsis (three dots), a click on which would notmally open the drawer to display more detailed information
 * - an eye
 * also allows space for a chevron that indicates whether all group elements are visible or not
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import VisibilityIcon from 'src/shared/components/visibility-icon/VisibilityIcon';

import Ellipsis from 'static/icons/icon_ellipsis.svg';

import { TrackActivityStatus } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import { Status } from 'src/shared/types/status';

import styles from './TrackPanelItemLayout.scss';

export type Props = {
  visibilityStatus?: TrackActivityStatus | Status.PARTIALLY_SELECTED;
  onChangeVisibility?: () => void;
  getVisibilityIconHelpText?: (
    status: TrackActivityStatus | Status.PARTIALLY_SELECTED
  ) => string;
  onShowMore?: () => void;
  isHighlighted?: boolean;
  highlightOnHover?: boolean;
  children: ReactNode;
};

const SimpleTrackPanelItemLayout = (props: Props) => {
  const {
    visibilityStatus,
    onChangeVisibility,
    onShowMore,
    isHighlighted,
    highlightOnHover = true,
    children
  } = props;

  const containerClasses = classNames(styles.grid, {
    [styles.highlighted]: isHighlighted,
    [styles.highlightableOnHover]: highlightOnHover
  });

  return (
    <div className={containerClasses}>
      <div className={styles.content}>{children}</div>
      <div className={styles.showMore}>
        {onShowMore && (
          <ImageButton
            status={Status.DEFAULT}
            description="More information"
            onClick={onShowMore}
            image={Ellipsis}
          />
        )}
      </div>
      <div className={styles.visibilitySwitch}>
        {visibilityStatus && onChangeVisibility && (
          <VisibilityIcon
            status={visibilityStatus}
            description={props.getVisibilityIconHelpText?.(visibilityStatus)}
            onClick={onChangeVisibility}
          />
        )}
      </div>
    </div>
  );
};

SimpleTrackPanelItemLayout.defaultProps = {
  getVisibilityIconHelpText: (
    status: NonNullable<Props['visibilityStatus']>
  ) => {
    return status === Status.UNSELECTED ? 'Show this track' : 'Hide this track';
  }
};

export default SimpleTrackPanelItemLayout;
