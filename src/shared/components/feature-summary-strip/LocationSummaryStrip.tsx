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

import React, { forwardRef, type ForwardedRef } from 'react';
import classNames from 'classnames';

import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';

import styles from './FeatureSummaryStrip.module.css';

import { FocusLocation } from 'src/shared/types/focus-object/focusObjectTypes';

type Props = {
  location: FocusLocation;
  isGhosted?: boolean;
  className?: string;
};

const LocationSummaryStrip = (
  props: Props,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const { location, isGhosted } = props;
  const stripClasses = classNames(styles.featureSummaryStrip, props.className, {
    [styles.featureSummaryStripGhosted]: isGhosted
  });
  return (
    <div className={stripClasses} ref={ref}>
      <span className={styles.featureSummaryStripLabel}>Location:</span>
      <span className={styles.featureDisplayName}>
        {getFormattedLocation(location.location)}
      </span>
    </div>
  );
};

export default forwardRef(LocationSummaryStrip);
