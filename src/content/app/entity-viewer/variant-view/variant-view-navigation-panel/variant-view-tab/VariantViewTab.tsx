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

import TabButton from 'src/shared/components/tab-button/TabButton';
import InfoPill from 'src/shared/components/info-pill/InfoPill';

import styles from './VariantViewTab.module.css';

type Props = {
  viewId: string;
  tabText: string;
  labelText?: string;
  pillContent?: string | number;
  onClick?: (viewId: string) => void;
  pressed: boolean;
  disabled?: boolean;
  unavailable?: boolean; // temporary marker for a tab whose content won't be available for a long time
};

const VariantViewTab = (props: Props) => {
  const { viewId, tabText, pressed, disabled, unavailable } = props;

  const onClick = () => {
    props.onClick?.(viewId);
  };

  if (unavailable) {
    const tabClasses = classNames(styles.tab, styles.unavailable);

    return (
      <TabButton pressed={false} disabled className={tabClasses}>
        {tabText}
      </TabButton>
    );
  }

  const componentClasses = classNames(styles.container, {
    [styles.disabled]: disabled
  });

  return (
    <div className={componentClasses}>
      <TabButton
        className={styles.tab}
        pressed={pressed}
        disabled={disabled}
        onClick={onClick}
      >
        {tabText}
      </TabButton>
      <BottomRow {...props} />
    </div>
  );
};

const BottomRow = (props: Props) => {
  const { labelText, pillContent } = props;

  if (!labelText && !pillContent) {
    return null;
  }

  return (
    <div className={styles.bottomRow}>
      {labelText && <span className={styles.label}>{labelText}</span>}
      {pillContent && (
        <InfoPill className={styles.pill}>{pillContent}</InfoPill>
      )}
    </div>
  );
};

export default VariantViewTab;
